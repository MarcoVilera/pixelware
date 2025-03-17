const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')
// Create an instance of Express app
const app = express()

// Middleware setup
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
) // Enable CORS
app.use(helmet()) // Add security headers
app.use(morgan('combined')) // Log HTTP requests
app.disable('x-powered-by') // Hide Express server information

// Define routes and corresponding microservices
const services = [
    {
        route: '/users',
        target: 'http://localhost:3001/api/users',
    },
    {
        route: '/products',
        target: 'http://localhost:3002/api/products',
    },
    {
        route: '/reviews',
        target: 'http://localhost:3003/api/reviews',
    },
    {
        route: '/payments',
        target: 'http://localhost:3004/',
    },
]

// Define rate limit constants
// const rateLimit = 20 // Max requests per minute
// const interval = 60 * 1000 // Time window in milliseconds (1 minute)

// // Object to store request counts for each IP address
// const requestCounts = {}

// // Reset request count for each IP address every 'interval' milliseconds
// setInterval(() => {
//     Object.keys(requestCounts).forEach((ip) => {
//         requestCounts[ip] = 0 // Reset request count for each IP address
//     })
// }, interval)

// // Middleware function for rate limiting and timeout handling
// function rateLimitAndTimeout(req, res, next) {
//     const ip = req.ip // Get client IP address

//     // Update request count for the current IP
//     requestCounts[ip] = (requestCounts[ip] || 0) + 1

//     // Check if request count exceeds the rate limit
//     if (requestCounts[ip] > rateLimit) {
//         // Respond with a 429 Too Many Requests status code
//         return res.status(429).json({
//             code: 429,
//             status: 'Error',
//             message: 'Rate limit exceeded.',
//             data: null,
//         })
//     }

//     // Set timeout for each request (example: 10 seconds)
//     req.setTimeout(15000, () => {
//         // Handle timeout error
//         res.status(504).json({
//             code: 504,
//             status: 'Error',
//             message: 'Gateway timeout.',
//             data: null,
//         })
//         req.abort() // Abort the request
//     })

//     next() // Continue to the next middleware
// }

// Apply the rate limit and timeout middleware to the proxy
// app.use(rateLimitAndTimeout)

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
    // Proxy options
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route}`]: '',
        },
        onProxyRes: function (proxyRes, req, res) {
            // Elimina encabezados de CORS del microservicio para evitar conflictos
            delete proxyRes.headers['access-control-allow-origin']
            delete proxyRes.headers['access-control-allow-credentials']
        },
    }

    // Apply rate limiting and timeout middleware before proxying
    app.use(route, createProxyMiddleware(proxyOptions))
})

app.get('/health', async (_req, res) => {
    try {
        const healthChecks = services.map(async (service) => {
            const healthUrl = `${service.target.replace('localhost', '127.0.0.1')}/health`
            try {
                const response = await axios.get(healthUrl, {
                    timeout: 5000,
                    family: 4, // Forzar IPv4
                })
                return {
                    service: service.route,
                    status: 'OK',
                    statusCode: response.status,
                    data: response.data,
                }
            } catch (error) {
                let errorMessage
                if (error.response) {
                    errorMessage = `HTTP Error: ${error.response.status}`
                } else if (error.request) {
                    errorMessage = `No response: ${error.code || 'Timeout'}`
                } else {
                    errorMessage = error.message
                }

                return {
                    service: service.route,
                    status: 'Error',
                    error: errorMessage,
                    details: error.config?.url, // URL que falló
                }
            }
        })

        const results = await Promise.all(healthChecks)
        res.status(200).json({
            code: 200,
            status: 'Success',
            message: 'Health check completed',
            data: results,
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'Error',
            message: 'Internal server error',
            error: error.message,
        })
    }
})
app.use((_req, res) => {
    res.status(404).json({
        code: 404,
        status: 'Error',
        message: 'Route not found.',
        data: null,
    })
})

// Define port for Express server
const PORT = process.env.PORT || 5000

// Start Express server
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`)
})
