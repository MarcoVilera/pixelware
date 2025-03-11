import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
    // Relaciones obligatorias
    id: {
        type: String,
    },
    productId: {
        type: String,
        required: [true, 'El producto es requerido'],
    },
    userId: {
        type: Number,
        required: [true, 'El usuario es requerido'],
        unique: [true, 'Solo se permite una review por usuario y producto'],
    },
    user_name: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
    },
    // Datos principales
    rating: {
        type: Number,
        required: [true, 'La calificación es requerida'],
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5'],
    },
    comment: {
        type: String,
        maxlength: [500, 'El comentario no puede exceder los 500 caracteres'],
    },

    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    // Auditoría
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    edited: {
        type: Boolean,
        default: false,
    },
})

export default model('Reviews', reviewSchema)
