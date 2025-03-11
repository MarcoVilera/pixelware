import pkg from 'jsonwebtoken'
const { verify } = pkg
import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    const token = req.cookies.token // Obtener token de las cookies

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId // Asignar el ID del usuario al request
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' })
    }
}

export default verifyToken
