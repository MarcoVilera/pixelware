import { Schema, model } from 'mongoose'

const productSchema = new Schema({
    id: String,
    name: String,
    description: String,
    price: Number,
    stock: Number,
    images: [String],
    category: String,
    brand: String,
    rating: {
        average: { type: Number, default: 0 }, // Promedio actual
        totalRatings: { type: Number, default: 0 }, // Cantidad de valoraciones
        sumRatings: { type: Number, default: 0 }, // Suma acumulada
    },
})
productSchema.index(
    {
        name: 'text',
        description: 'text',
    },
    {
        weights: {
            name: 3, // Priorizar nombre sobre descripción
            description: 1,
        },
        name: 'product_search_index',
    }
)
export default model('Product', productSchema)
