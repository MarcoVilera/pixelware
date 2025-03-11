import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// Variables de entorno
const DBHOST = process.env.DBHOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASS || 'root'
const DB_NAME = process.env.DB_NAME || 'pixelware-users-db'
const DB_PORT = process.env.DB_PORT || 3306

//Crear conexión a la base de datos
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DBHOST,
    dialect: 'mysql',
    port: DB_PORT,
    define: {
        timestamps: false,
    },
})
export default sequelize
