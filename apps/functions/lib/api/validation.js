"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withValidation = exports.validate = void 0;
const functions = require("firebase-functions");
const zod_1 = require("zod");
/**
 * Validates request data against a Zod schema
 * @param schema Zod schema
 * @param data Request data
 * @returns Validated data or throws HttpsError
 */
const validate = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new functions.https.HttpsError('invalid-argument', 'Validation failed', error.issues);
        }
        throw error;
    }
};
exports.validate = validate;
/**
 * Higher-order function to wrap a callable function with validation
 */
const withValidation = (schema, handler) => {
    return (data, context) => {
        const validatedData = (0, exports.validate)(schema, data);
        return handler(validatedData, context);
    };
};
exports.withValidation = withValidation;
//# sourceMappingURL=validation.js.map