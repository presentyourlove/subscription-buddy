import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as functions from 'firebase-functions'

export const initSentry = () => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Tracing
        tracesSampleRate: 1.0,
        // Profiling
        profilesSampleRate: 1.0,
    })
}

export const wrapHttpFunction = (handler: (req: functions.https.Request, resp: functions.Response) => void | Promise<void>) => {
    return Sentry.handlers.requestHandler()(handler as any)
}
