import express from 'express'
import { json } from 'express'
import { connect } from 'mongoose'
import reviewRouter from './routes/reviewRoutes.js'
const app = express()
app.use(json())

// Conexión a MongoDB
connect('mongodb://127.0.0.1:27017/pixelware_reviews')

app.use('/api/reviews', reviewRouter)
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Product Service corriendo en http://localhost:${PORT}`)
})
