import * as functions from 'firebase-functions'
import { z } from 'zod'

/**
 * Validates request data against a Zod schema
 * @param schema Zod schema
 * @param data Request data
 * @returns Validated data or throws HttpsError
 */
export const validate = <T>(schema: z.Schema<T>, data: any): T => {
    try {
        return schema.parse(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Validation failed',
                error.errors
            )
        }
        throw error
    }
}

/**
 * Higher-order function to wrap a callable function with validation
 */
export const withValidation = <T, R>(
    schema: z.Schema<T>,
    handler: (data: T, context: functions.https.CallableContext) => Promise<R> | R
) => {
    return (data: any, context: functions.https.CallableContext) => {
        const validatedData = validate(schema, data)
        return handler(validatedData, context)
    }
}
