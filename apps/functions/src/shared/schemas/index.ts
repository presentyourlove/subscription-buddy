import { z } from 'zod'

// User Schema
export const UserSchema = z.object({
    displayName: z
        .string()
        .min(1, 'Display name is required')
        .max(50, 'Display name too long'),
    photoURL: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional()
})

// Group Schema
export const GroupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().max(500).optional(),
    platform: z.string().min(1, 'Platform is required'),
    price: z.number().min(0, 'Price must be positive'),
    cycle: z.enum(['monthly', 'quarterly', 'yearly', 'one-time']),
    currency: z.string().length(3),
    maxMembers: z.number().int().min(1).max(50),
    currentMembers: z.number().int().min(1),
    tags: z.array(z.string()).optional()
})

export type User = z.infer<typeof UserSchema>
export type Group = z.infer<typeof GroupSchema>
