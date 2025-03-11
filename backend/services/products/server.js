import express from 'express'
import { json } from 'express'
import { connect } from 'mongoose'
import productRouter from './routes/productsRoutes.js'
import seedDatabase from './mock.js' // Asegúrate de la ruta correcta
import Product from './models/Products/index.js'
import Category from './models/Category/index.js'
import Rating from './models/Rating/index.js'
const app = express()
app.use(json())

// Conexión a MongoDB con verificación de datos
const startServer = async () => {
    try {
        await connect('mongodb://127.0.0.1:27017/pixelware_items')
        console.log('Conectado a MongoDB')

        // Verificar si la base está vacía
        const [productsCount, categoriesCount, ratingCount] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Rating.countDocuments(),
        ])

        if (productsCount === 0 && categoriesCount === 0 && ratingCount === 0) {
            console.log('Base de datos vacía - Cargando datos iniciales...')
            await seedDatabase()
        }

        app.use('/api/products', productRouter)

        const PORT = process.env.PORT || 3002
        app.listen(PORT, () => {
            console.log(`Product Service corriendo en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Error de inicio:', error)
        process.exit(1)
    }
}

startServer()
