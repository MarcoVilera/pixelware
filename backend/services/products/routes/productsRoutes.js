import { Router } from 'express'
const productRouter = Router()
import Product from '../models/Products/index.js'
import Category from '../models/Category/index.js'
import Rating from '../models/Rating/index.js'
// Función para calcular checksum simple
function calculateChecksum(str) {
    return str.split('').reduce((acc, char) => (acc + char.charCodeAt(0)) % 10, 0)
}

// Endpoint de prueba para verificar que el servicio está corriendo
productRouter.get('/health', (_req, res) => {
    res.status(200).json({ message: 'Product Service corriendo' })
})

// Obtener todos los productos
productRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, brand, minRating, sort } = req.query

        const filter = {}
        let sortOptions = {}

        // Búsqueda por texto
        if (search) {
            filter.$text = { $search: search }

            // Opcional: Ordenar por relevancia
            sortOptions.score = { $meta: 'textScore' }
        }

        // Filtros
        if (category) filter.category = category
        if (brand) filter.brand = brand
        if (minRating) filter['rating.average'] = { $gte: parseFloat(minRating) }

        // Ordenamiento
        if (sort) {
            const [field, order] = sort.split('_')
            sortOptions[field] = order === 'desc' ? -1 : 1
        }

        // Paginación
        const parsedPage = Math.max(1, parseInt(page))
        const parsedLimit = Math.min(parseInt(limit) || 10, 100)
        const skip = (parsedPage - 1) * parsedLimit

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortOptions).skip(skip).limit(parsedLimit).lean(), // Para mejorar performance

            Product.countDocuments(filter),
        ])

        res.json({
            data: products,
            pagination: {
                totalItems: total,
                currentPage: parsedPage,
                totalPages: Math.ceil(total / parsedLimit),
                itemsPerPage: parsedLimit,
            },
        })
    } catch (error) {
        res.status(500).json({
            error: 'Error al buscar productos',
            details: error.message,
        })
    }
})
// Obtener todas las categorias
productRouter.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find()
        res.json({ categories })
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener categorías',
            details: error.message,
        })
    }
})

// Obtener un producto por su id
productRouter.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id })

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado',
            })
        }

        res.json({
            success: true,
            product: {
                ...product.toObject(),
                rating: product.rating.average.toFixed(1), // Formatear a 1 decimal
                totalRatings: product.rating.totalRatings,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener el producto',
        })
    }
})

//Crear un nuevo producto, si la categoría no existe, la crea
productRouter.post('/new', async (req, res) => {
    const { category, brand } = req.body

    const categoryExists = await Category.findOne({ name: category })
    if (!categoryExists) {
        const newCategory = new Category({ name: category })
        await newCategory.save()
    }
    const timestamp = Date.now().toString().slice(-6) // Últimos 6 dígitos del timestamp
    const brandCode = brand.slice(0, 3).toUpperCase().padEnd(3, 'X')
    const categoryCode = category.slice(0, 3).toUpperCase().padEnd(3, 'X')
    const checksum = calculateChecksum(`${brandCode}${categoryCode}${timestamp}`)
    const productId = `${brandCode}-${categoryCode}-${timestamp}-${checksum}`
    const newProduct = new Product({
        ...req.body,
        id: productId,
        category: category,
        brand: brand,
    })
    await newProduct.save()
    res.json({ status: 'Producto creado' })
})

// Actualizar un producto, utilizando su campo id, si se cambia la categoria y no existe, la crea
productRouter.put('/update/:id', async (req, res) => {
    const { category } = req.body
    const categoryExists = await Category.findOne({ name: category })
    if (!categoryExists) {
        const newCategory = new Category({ name: category })
        await newCategory.save()
    }
    await Product.findOneAndUpdate({ id: req.params.id }, req.body)
    res.json({ status: 'Producto actualizado' })
})
// Endpoint para rating
productRouter.post('/:productId/rate', async (req, res) => {
    try {
        const { value, userId } = req.body // userId viene del body
        const { productId } = req.params

        // Validaciones básicas
        if (!userId) return res.status(400).json({ error: 'Se requiere userId' })
        if (value < 1 || value > 5) {
            return res.status(400).json({ error: 'Valoración debe ser 1-5' })
        }

        // Verificar existencia del producto
        const product = await Product.find({ id: productId })
        if (!product) return res.status(404).json({ error: 'Producto no existe' })

        // Evitar múltiples ratings del mismo usuario
        const existingRating = await Rating.findOne({
            productId,
            userId,
        })

        if (existingRating) {
            return res.status(400).json({ error: 'Ya calificaste este producto' })
        }
        // Actualización en paralelo
        const [_, updatedProduct] = await Promise.all([
            new Rating({ productId, userId, value }).save(),
            Product.findOneAndUpdate(
                { id: productId },
                {
                    $inc: {
                        'rating.totalRatings': 1,
                        'rating.sumRatings': value,
                    },
                },
                { new: true }
            ),
        ])
        // Calcular nuevo promedio
        const newAverage = updatedProduct.rating.sumRatings / updatedProduct.rating.totalRatings
        //Actualizar promedio en el producto
        await Product.findOneAndUpdate({ id: productId }, { $set: { 'rating.average': newAverage } })
        res.json({
            success: true,
            newAverage: newAverage.toFixed(1),
        })
    } catch (error) {
        res.status(500).json({
            error: 'Error al calificar producto',
            details: error.message,
        })
    }
})
// Eliminar un producto, utilizando su campo id, si es el unico item con esa categoria, la elimina
productRouter.delete('/delete/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id })
    const category = product.category
    await Product.findOneAndDelete({ id: req.params.id })
    const products = await Product.find()
    const categoryProducts = products.filter((product) => product.category === category)
    if (categoryProducts.length === 0) {
        await Category.findOneAndDelete({ name: category })
    }
    res.json({ status: 'Producto eliminado' })
})

export default productRouter
