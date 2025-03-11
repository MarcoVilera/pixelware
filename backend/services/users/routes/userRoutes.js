import { Router } from 'express'
const userRouter = Router()
import User from '../models/User/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/authMiddleware.js' // Middleware para verificar token

import dotenv from 'dotenv'
dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET

// Registro de usuario
userRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear usuario con Sequelize
        const user = await User.create({ name, email, password: hashedPassword, address, phone })

        res.status(201).json({ message: 'Usuario creado', user })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El email ya está registrado' })
        }
        res.status(500).json({ error: 'Error al registrar', error })
    }
})

// Login
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })
        // Configurar la cookie
        res.cookie('token', token, {
            httpOnly: true, // Solo accesible por el servidor
            secure: process.env.NODE_ENV === 'production', // HTTPS en producción
            sameSite: 'strict', // Prevención CSRF
            maxAge: 3600000, // 1 hora en milisegundos
            path: '/', // Accesible en todas las rutas
        })

        res.json({
            success: true,
            message: 'Login exitoso',
            user: { id: user.id, email: user.email },
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', error })
    }
})

//Obtener info del usuario
userRouter.get('/info/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id }, attributes: { exclude: ['password'] } })
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' })
    }
})

//Editar usuario, hashear nueva contraseña, en caso de que se envie
userRouter.put('/edit/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } })
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        const { name, email, password, address, phone } = req.body
        let hashedPassword = user.password
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        await User.update({ name, email, password: hashedPassword, address, phone }, { where: { id: req.params.id } })
        res.json({ status: 'Usuario actualizado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' })
    }
})

// Endpoint de prueba para verificar que el servicio está corriendo
userRouter.get('/health', (_req, res) => {
    res.status(200).json({ message: 'User Service corriendo' })
})
export default userRouter
