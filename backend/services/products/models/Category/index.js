import { Schema, model } from 'mongoose'

const categorySchema = new Schema({
    name: String,
    description: String,
})

export default model('Category', categorySchema)
