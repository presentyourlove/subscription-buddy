import * as admin from 'firebase-admin'
import * as crypto from 'crypto'

import { logger } from './logger'

const LOCK_COLLECTION = 'sys_locks'

/**
 * Tries to acquire a distributed lock for a specific resource.
 * Uses a "Lease" pattern with TTL.
 *
 * @param resourceId Unique identifier for the resource to lock (e.g. 'group_123_join')
 * @param ttlMs Time-to-live in milliseconds (default: 5000ms)
 * @returns lockId if successful, null if failed (already locked)
 */
export const acquireLock = async (
    resourceId: string,
    ttlMs = 5000
): Promise<string | null> => {
    const db = admin.firestore()
    const lockRef = db.collection(LOCK_COLLECTION).doc(resourceId)
    const now = Date.now()
    const expiresAt = now + ttlMs
    const lockId = `lock_${now}_${crypto.randomBytes(6).toString('hex')}`

    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(lockRef)

            if (doc.exists) {
                const data = doc.data()
                // Check if existing lock is expired
                if (data && data.expiresAt > now) {
                    throw new Error('LOCKED')
                }
                // If expired, we can take over (Lease stealing) or just overwrite?
                // Overwriting is safe because the previous owner should obtain failure on release or heartbeats.
                // But safer is strictly respecting TTL.
            }

            t.set(lockRef, {
                lockId,
                expiresAt,
                acquiredAt: now
            })
        })

        logger.info(`Lock acquired: ${resourceId} (${lockId})`)
        return lockId
    } catch (error) {
        // Transaction failed or aborted (Locked)
        return null
    }
}

/**
 * Releases a lock if the lockId matches.
 *
 * @param resourceId Resource identifier
 * @param lockId The lockId returned by acquireLock
 */
export const releaseLock = async (
    resourceId: string,
    lockId: string
): Promise<void> => {
    const db = admin.firestore()
    const lockRef = db.collection(LOCK_COLLECTION).doc(resourceId)

    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(lockRef)

            if (!doc.exists) return // Already released

            const data = doc.data()
            if (data && data.lockId === lockId) {
                t.delete(lockRef)
            } else {
                // Lock ownership changed (expired and stolen by someone else), do nothing
                logger.warn(
                    `Lock release failed: Ownership changed for ${resourceId}`
                )
            }
        })
        logger.info(`Lock released: ${resourceId} `)
    } catch (error) {
        logger.error(`Error releasing lock ${resourceId} `, error)
    }
}
