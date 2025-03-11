import express, { json } from 'express'
import sequelize from './db.js'
import authRoutes from './routes/userRoutes.js'
import cors from 'cors'
const app = express()
app.use(json())
app.use(
    cors({
        origin: '*',
        credentials: true, // Permite cookies
    })
)
sequelize
    .sync({ force: false }) // force: true solo para desarrollo (borra tablas)
    .then(() => console.log('Base de datos conectada'))
    .catch((err) => console.error('Error de conexión:', err))

// Rutas
app.use('/api/users', authRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`User Service corriendo en http://localhost:${PORT}`)
})
