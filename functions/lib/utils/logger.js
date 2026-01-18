"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.maskData = void 0;
const functions = require("firebase-functions");
// Regex for PII detection
// Email: 保留前 3 碼 (若長度>3)，其餘遮蔽
const EMAIL_REGEX = /([a-zA-Z0-9._-]{3})([a-zA-Z0-9._-]+)(@[a-zA-Z0-9._-]+\.[a-z]+)/gi;
// Phone: 台灣手機格式 09xx-xxx-xxx or 09xxxxxxxx
const PHONE_REGEX = /(09\d{2})[- ]?(\d{3})[- ]?(\d{3})/g;
// Sensitive Keys to mask completely (Case Insensitive Partial Match)
const SENSITIVE_KEYS = [
    'password',
    'token',
    'secret',
    'authorization',
    'cookie',
    'key',
    'auth'
];
/**
 * 遞迴遮蔽敏感資料 (PII Masking)
 * @param data 任意資料 (String, Object, Array)
 * @returns 遮蔽後的資料
 */
const maskData = (data) => {
    if (typeof data === 'string') {
        // Mask Email: tes***@gmail.com
        let masked = data.replace(EMAIL_REGEX, '$1***$3');
        // Mask Phone: 0912-***-789
        masked = masked.replace(PHONE_REGEX, '$1-***-$3');
        return masked;
    }
    if (Array.isArray(data)) {
        return data.map((item) => (0, exports.maskData)(item));
    }
    if (typeof data === 'object' && data !== null) {
        // Handle specific object types we don't want to traverse deeply or modify
        if (data instanceof Date)
            return data;
        const maskedObj = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Check if key is sensitive
                const isSensitive = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k));
                if (isSensitive) {
                    maskedObj[key] = '[MASKED]';
                }
                else {
                    maskedObj[key] = (0, exports.maskData)(data[key]);
                }
            }
        }
        return maskedObj;
    }
    return data;
};
exports.maskData = maskData;
/**
 * 結構化日誌記錄器 (Structured Logger)
 * 自動整合 Firebase Cloud Logging 並執行 PII Masking
 */
exports.logger = {
    info: (message, meta) => {
        const payload = meta ? Object.assign({ message }, meta) : { message };
        functions.logger.info((0, exports.maskData)(payload));
    },
    warn: (message, meta) => {
        const payload = meta ? Object.assign({ message }, meta) : { message };
        functions.logger.warn((0, exports.maskData)(payload));
    },
    error: (message, error) => {
        // Error objects need special handling to extract message/stack
        let errPayload = error;
        if (error instanceof Error) {
            errPayload = {
                name: error.name,
                message: error.message,
                stack: error.stack // Stack trace might contain PII, but usually acceptable for internal debug. Can apply masking to stack string if strict.
            };
        }
        const payload = { message, error: errPayload };
        functions.logger.error((0, exports.maskData)(payload));
    }
};
//# sourceMappingURL=logger.js.map