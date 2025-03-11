import { Schema, model } from 'mongoose'

const ratingSchema = new Schema({
    productId: { type: String, required: true },
    userId: { type: Number, required: true },
    value: { type: Number, min: 1, max: 5, required: true }, // Escala 1-5
    createdAt: { type: Date, default: Date.now },
})

export default model('Rating', ratingSchema)
