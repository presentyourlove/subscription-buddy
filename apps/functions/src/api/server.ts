import * as cors from 'cors'
import * as express from 'express'

import helmet from 'helmet'

import { logger } from '../utils/logger'

const app = express()
app.disable('x-powered-by') // Hide Express server information
app.use(helmet()) // Security Headers

// 1. Basic Middleware
// CORS: Configure allowed origins explicitly for security
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://subscription-buddy.web.app'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

// 2. Custom Middleware (Logger)
app.use((req, res, next) => {
    logger.info(`[API] ${req.method} ${req.path}`)
    next()
})

import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from '../generated/routes'

// ... existing code ...

// 3. Health Check (Legacy - kept for reference, but controller takes precedence if route matches)
/* 
app.get('/health', (req, res) => {
    ...
})
*/

// 3.5 Swagger UI
app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
    return res.send(
        swaggerUi.generateHTML(await import('../generated/swagger.json'))
    )
})

// 4. Routes (TSOA)
RegisterRoutes(app)
// app.use('/v1/groups', groupRoutes)
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
