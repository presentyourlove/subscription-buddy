"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// User Schema
exports.UserSchema = zod_1.z.object({
    displayName: zod_1.z
        .string()
        .min(1, 'Display name is required')
        .max(50, 'Display name too long'),
    photoURL: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    email: zod_1.z.string().email().optional()
});
// Group Schema
exports.GroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: zod_1.z.string().max(500).optional(),
    platform: zod_1.z.string().min(1, 'Platform is required'),
    price: zod_1.z.number().min(0, 'Price must be positive'),
    cycle: zod_1.z.enum(['monthly', 'quarterly', 'yearly', 'one-time']),
    currency: zod_1.z.string().length(3),
    maxMembers: zod_1.z.number().int().min(1).max(50),
    currentMembers: zod_1.z.number().int().min(1),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
//# sourceMappingURL=index.js.map