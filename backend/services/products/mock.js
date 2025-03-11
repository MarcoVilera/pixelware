import mongoose from 'mongoose'
import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import Product from './models/Products/index.js'
import Category from './models/Category/index.js'
import Rating from './models/Rating/index.js'

// Función para calcular checksum
function calculateChecksum(str) {
    return str.split('').reduce((acc, char) => (acc + char.charCodeAt(0)) % 10, 0)
}

// Configurar __dirname para ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url))

// Generar usuario único por rating usando timestamp
// let lastUserId = Math.floor(Date.now() / 1000)

async function seedDatabase() {
    try {
        // Cargar datos desde el JSON
        const data = await fs.readFile(`${__dirname}/products.json`, 'utf-8')
        const productsData = JSON.parse(data)
        if (productsData.products.length === 0) {
            throw new Error('No hay productos para cargar')
        } else {
            console.log('Productos cargados exitosamente!', productsData.products.length)
        }
        // Conexión a MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/pixelware_items')

        // Limpiar colecciones existentes
        await Promise.all([Product.deleteMany(), Category.deleteMany(), Rating.deleteMany()])

        for (const productData of productsData.products) {
            console.log('Creando producto:', productData)

            const { category, brand } = productData

            // Manejar categoría
            let categoryExists = await Category.findOne({ name: category })
            if (!categoryExists) {
                categoryExists = await new Category({ name: category }).save()
            }

            // Generar ID del producto
            const timestamp = Date.now().toString().slice(-6)
            const brandCode = brand.slice(0, 3).toUpperCase().padEnd(3, 'X')
            const categoryCode = category.slice(0, 3).toUpperCase().padEnd(3, 'X')
            const checksum = calculateChecksum(`${brandCode}${categoryCode}${timestamp}`)
            const productId = `${brandCode}-${categoryCode}-${timestamp}-${checksum}`

            // Crear producto inicial
            const newProduct = await new Product({
                ...productData,
                id: productId,
                rating: {
                    average: 0,
                    totalRatings: 0,
                    sumRatings: 0,
                },
            }).save()

            // Generar ratings aleatorios
            const numRatings = Math.floor(Math.random() * 15)
            const ratingsBatch = []
            let totalRatings = 0
            let sumRatings = 0

            for (let i = 0; i < numRatings; i++) {
                const lastUserId = Math.floor(Math.random() * 20) + 1
                const value = Math.floor(Math.random() * 5) + 1

                ratingsBatch.push({
                    productId: productId,
                    userId: lastUserId,
                    value: value,
                    createdAt: new Date(),
                })

                totalRatings++
                sumRatings += value
            }

            // Insertar ratings y actualizar producto
            if (ratingsBatch.length > 0) {
                await Rating.insertMany(ratingsBatch)

                await Product.updateOne(
                    { id: productId },
                    {
                        $set: {
                            'rating.average': (sumRatings / totalRatings).toFixed(1), // Calcular promedio redondeado a 1 decimal
                            'rating.totalRatings': totalRatings,
                            'rating.sumRatings': sumRatings,
                        },
                    }
                )
            }
        }

        console.log('Base de datos poblada exitosamente!')
        console.log(`- Productos creados: ${productsData.products.length}`)
        console.log(`- Ratings generados: ${await Rating.countDocuments()}`)
    } catch (error) {
        console.error('Error durante la carga:', error)
    } finally {
        await mongoose.disconnect()
    }
}

export default seedDatabase
