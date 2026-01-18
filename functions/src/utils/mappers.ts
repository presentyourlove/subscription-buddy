import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore'
import { GroupDTO, UserDTO } from '../types/dto'

/**
 * Generic mapper to convert Firestore DocumentSnapshot to DTO
 * @param doc Firestore DocumentSnapshot
 * @param transform Function to transform data
 */
export const mapDocumentToDTO = <T>(
    doc: DocumentSnapshot,
    transform: (data: DocumentData, id: string) => T
): T | null => {
    if (!doc.exists) return null
    return transform(doc.data()!, doc.id)
}

/**
 * Maps raw Firestore data to GroupDTO
 * Explicitly selects allowed fields to prevent data leakage
 */
export const toGroupDTO = (data: DocumentData, id: string): GroupDTO => {

    return {
        id,
        name: data.name || '',
        description: data.description || '',
        platform: data.platform || '',
        price: Number(data.price) || 0,
        cycle: data.cycle || 'monthly',
        currency: data.currency || 'TWD',
        maxMembers: Number(data.maxMembers) || 4,
        currentMembers: Number(data.currentMembers) || 1,
        ownerId: data.ownerId || '',
        status: data.status || 'open',
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        // updatedAt is optional
    }
}

/**
 * Maps raw Firestore data to UserDTO
 */
export const toUserDTO = (data: DocumentData, id: string): UserDTO => {
    return {
        id,
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL,
        // Email handled conditionally in higher layers if needed, strictly guarded here
        // email: data.email ... policy decision
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }
}
