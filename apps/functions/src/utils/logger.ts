import * as functions from 'firebase-functions'

// Regex for PII detection
// Email: Safe pattern with limited quantifiers and proper capture groups
// Group 1: first 3 chars, Group 2: rest before @, Group 3: @domain
const EMAIL_REGEX = /([a-zA-Z0-9]{1,3})([a-zA-Z0-9._%+-]{0,20})(@[a-zA-Z0-9.-]{1,30}\.[a-z]{2,6})/gi

// Phone: 台灣手機格式 09xx-xxx-xxx or 09xxxxxxxx
// Safe pattern with specific digit counts and proper capture groups
// Group 1: 09xx, Group 2: xxx, Group 3: xxx
const PHONE_REGEX = /(09\d{2})[-\s]?(\d{3})[-\s]?(\d{3})/g

// Sensitive Keys to mask completely (Case Insensitive Partial Match)
const SENSITIVE_KEYS = [
    'password',
    'token',
    'secret',
    'authorization',
    'cookie',
    'key',
    'auth'
]

/**
 * 遞迴遮蔽敏感資料 (PII Masking)
 * @param data 任意資料 (String, Object, Array)
 * @returns 遮蔽後的資料
 */
export const maskData = (data: any): any => {
    if (typeof data === 'string') {
        // Mask Email: tes***@gmail.com
        let masked = data.replace(EMAIL_REGEX, '$1***$3')

        // Mask Phone: 0912-***-678
        masked = masked.replace(PHONE_REGEX, '$1-***-$3')


        return masked
    }

    if (Array.isArray(data)) {
        return data.map((item) => maskData(item))
    }

    if (typeof data === 'object' && data !== null) {
        // Handle specific object types we don't want to traverse deeply or modify
        if (data instanceof Date) return data

        const maskedObj: any = {}
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Check if key is sensitive
                const isSensitive = SENSITIVE_KEYS.some((k) =>
                    key.toLowerCase().includes(k)
                )

                if (isSensitive) {
                    maskedObj[key] = '[MASKED]'
                } else {
                    maskedObj[key] = maskData(data[key])
                }
            }
        }
        return maskedObj
    }

    return data
}

/**
 * 結構化日誌記錄器 (Structured Logger)
 * 自動整合 Firebase Cloud Logging 並執行 PII Masking
 */
export const logger = {
    info: (message: string, meta?: any) => {
        const payload = meta ? { message, ...meta } : { message }
        functions.logger.info(maskData(payload))
    },

    warn: (message: string, meta?: any) => {
        const payload = meta ? { message, ...meta } : { message }
        functions.logger.warn(maskData(payload))
    },

    error: (message: string, error?: any) => {
        // Error objects need special handling to extract message/stack
        let errPayload = error
        if (error instanceof Error) {
            errPayload = {
                name: error.name,
                message: error.message,
                stack: error.stack // Stack trace might contain PII, but usually acceptable for internal debug. Can apply masking to stack string if strict.
            }
        }

        const payload = { message, error: errPayload }
        functions.logger.error(maskData(payload))
    }
}
