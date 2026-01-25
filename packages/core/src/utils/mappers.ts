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
        title: data.title || data.name || '',
        description: data.description || '',
        serviceName: data.serviceName || '',
        price: typeof data.price === 'number' ? data.price : 0,
        slots: typeof data.slots === 'number' ? data.slots : DEFAULTS.MAX_SLOTS,
        hostId: data.hostId || '',
        hostName: data.hostName || '',
        hostAvatar: data.hostAvatar,
        status: data.status || 'OPEN',
        createdAt: data.createdAt
    }
}

