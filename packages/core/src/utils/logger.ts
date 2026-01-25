// Regex for PII detection
// Email: Safe pattern with limited quantifiers and proper capture groups
// Group 1: first 3 chars, Group 2: rest before @ (min 1 char), Group 3: @domain
const EMAIL_REGEX = /([a-zA-Z0-9]{3})([a-zA-Z0-9._%+-]{1,20})(@[a-zA-Z0-9.-]{1,30}\.[a-z]{2,6})/gi

// Phone: 台灣手機格式 09xx-xxx-xxx or 09xxxxxxxx
// Safe pattern with specific digit counts and proper capture groups
// Group 1: 09xx, Group 2: xxx, Group 3: xxx
const PHONE_REGEX = /(09\d{2})[-\s]?(\d{3})[-\s]?(\d{3})/g

// Sensitive Keys to mask completely (Case Insensitive Partial Match)
const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'cookie', 'key', 'auth']

/**
 * 遞迴遮蔽敏感資料 (PII Masking)
 * @param data 任意資料 (String, Object, Array)
 * @returns 遮蔽後的資料
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maskedObj: any = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Check if key is sensitive
        const isSensitive = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))

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
 * 前端日誌記錄器 (Frontend Logger)
 * 自動執行 PII Masking 後輸出至 Console
 */
export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log(maskData(message), ...args.map(maskData)) // NOSONAR
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.warn(maskData(message), ...args.map(maskData)) // NOSONAR
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.error(maskData(message), ...args.map(maskData)) // NOSONAR
  }
}
