import * as cors from 'cors'
import * as express from 'express'

import { logger } from '../utils/logger'

const app = express()

// 1. Basic Middleware
app.use(cors({ origin: true })) // Allow all origins for now (or restrict to app domain)
app.use(express.json())

// 2. Custom Middleware (Logger)
app.use((req, res, next) => {
    logger.info(`[API] ${req.method} ${req.path}`)
    next()
})

// 3. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})

// 4. Routes (Future Controllers)
// app.use('/v1/groups', groupRoutes)
// app.use('/v1/users', userRoutes)

// 5. Global Error Handler
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        logger.error('API Error', err)
        res.status(500).json({
            error: {
                message: 'Internal Server Error',
                id: req.headers['x-request-id'] // Forward trace ID if available
            }
        })
    }
)

export const apiApp = app
