/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group } from '../types'
import { DEFAULTS } from './constants'

/**
 * Convert raw Firestore data to Group DTO
 * Strictly picks only allowed fields to prevent data leaks.
 */
export const toGroupDTO = (data: any, id: string): Group => {
    return {
        id,
        name: data.name || '',
        description: data.description || '',
        price: typeof data.price === 'number' ? data.price : 0,
        currency: data.currency || DEFAULTS.CURRENCY_CODE,
        billingCycle: data.billingCycle || 'monthly',
        category: data.category || 'Other',
        tags: Array.isArray(data.tags) ? data.tags : [],
        hostId: data.hostId || '',
        maxMembers: typeof data.maxMembers === 'number' ? data.maxMembers : DEFAULTS.MAX_MEMBERS,
        currentMembers: typeof data.currentMembers === 'number' ? data.currentMembers : 1, // Default to 1 (host)
        status: data.status || 'open',
        createdAt: data.createdAt, // Timestamps passed as is
        image: data.image
    }
}
