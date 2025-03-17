import { Router } from 'express'
const reviewRouter = Router()

import Review from '../models/Review/index.js'

// Endpoint de prueba para verificar que el servicio está corriendo
reviewRouter.get('/health', (_req, res) => {
    res.status(200).json({ message: 'Review Service corriendo' })
})

reviewRouter.get('/:productId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1 // Página actual (default: 1)
        const limit = parseInt(req.query.limit) || 10 // Items por página (default: 10)
        const skip = (page - 1) * limit // Cálculo de documentos a saltar

        const [reviews, total] = await Promise.all([
            Review.find({ productId: req.params.productId }).skip(skip).limit(limit).sort({ createdAt: -1 }), // Ordenar por más recientes primero

            Review.countDocuments({ productId: req.params.productId }),
        ])

        const totalPages = Math.ceil(total / limit)

        res.json({
            data: reviews,
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        })
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener reseñas',
            details: error.message,
        })
    }
})

// Crear una nueva review
reviewRouter.post('/new', async (req, res) => {
    const { productId, userId, user_name, rating, comment } = req.body
    const id = `R${userId}-${productId}`
    const newReview = new Review({ id, productId, userId, user_name, rating, comment })
    await newReview.save()

    res.json({ success: true, review: newReview })
})

// Actualizar una review
reviewRouter.put('/:id', async (req, res) => {
    const { rating, comment } = req.body

    const updatedReview = await Review.findOneAndUpdate(req.params.id, { rating, comment, updatedAt: Date.now, edited: true }, { new: true })

    res.json({ success: true, review: updatedReview })
})

// Like o dislike a una review
reviewRouter.patch('/:id/vote', async (req, res) => {
    try {
        const { id } = req.params
        const { voteType } = req.body

        // Validar tipo de voto
        if (!['like', 'dislike'].includes(voteType)) {
            return res.status(400).json({ error: 'Tipo de voto inválido' })
        }

        // Actualización atómica
        const update = { $inc: { [voteType]: 1 } }

        const updatedReview = await Review.findOneAndUpdate(id, update, { new: true }).select('likes dislikes')

        if (!updatedReview) {
            return res.status(404).json({ error: 'Reseña no encontrada' })
        }

        res.json({
            success: true,
            likes: updatedReview.likes,
            dislikes: updatedReview.dislikes,
        })
    } catch (error) {
        res.status(500).json({
            error: 'Error al procesar el voto',
            details: error.message,
        })
    }
})

export default reviewRouter
