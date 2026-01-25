import { Get, Route, Controller, SuccessResponse, Response } from 'tsoa'
import { logger } from '../utils/logger'

interface HealthResponse {
    status: string
    timestamp: string
    version: string
}

@Route('health')
export class HealthController extends Controller {
    /**
     * Retrieves the current health status of the service.
     */
    @Get()
    @SuccessResponse('200', 'OK')
    @Response('500', 'Internal Server Error')
    public async getHealth(): Promise<HealthResponse> {
        logger.info('Health check requested')
        return {
            status: 'UP',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        }
    }
}
