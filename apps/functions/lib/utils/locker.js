"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseLock = exports.acquireLock = void 0;
const admin = require("firebase-admin");
const logger_1 = require("./logger");
const LOCK_COLLECTION = 'sys_locks';
/**
 * Tries to acquire a distributed lock for a specific resource.
 * Uses a "Lease" pattern with TTL.
 *
 * @param resourceId Unique identifier for the resource to lock (e.g. 'group_123_join')
 * @param ttlMs Time-to-live in milliseconds (default: 5000ms)
 * @returns lockId if successful, null if failed (already locked)
 */
const acquireLock = async (resourceId, ttlMs = 5000) => {
    const db = admin.firestore();
    const lockRef = db.collection(LOCK_COLLECTION).doc(resourceId);
    const now = Date.now();
    const expiresAt = now + ttlMs;
    const lockId = `lock_${now}_${Math.random().toString(36).substr(2, 9)}`;
    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(lockRef);
            if (doc.exists) {
                const data = doc.data();
                // Check if existing lock is expired
                if (data && data.expiresAt > now) {
                    throw new Error('LOCKED');
                }
                // If expired, we can take over (Lease stealing) or just overwrite?
                // Overwriting is safe because the previous owner should obtain failure on release or heartbeats.
                // But safer is strictly respecting TTL.
            }
            t.set(lockRef, {
                lockId,
                expiresAt,
                acquiredAt: now
            });
        });
        logger_1.logger.info(`Lock acquired: ${resourceId} (${lockId})`);
        return lockId;
    }
    catch (error) {
        // Transaction failed or aborted (Locked)
        return null;
    }
};
exports.acquireLock = acquireLock;
/**
 * Releases a lock if the lockId matches.
 *
 * @param resourceId Resource identifier
 * @param lockId The lockId returned by acquireLock
 */
const releaseLock = async (resourceId, lockId) => {
    const db = admin.firestore();
    const lockRef = db.collection(LOCK_COLLECTION).doc(resourceId);
    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(lockRef);
            if (!doc.exists)
                return; // Already released
            const data = doc.data();
            if (data && data.lockId === lockId) {
                t.delete(lockRef);
            }
            else {
                // Lock ownership changed (expired and stolen by someone else), do nothing
                logger_1.logger.warn(`Lock release failed: Ownership changed for ${resourceId}`);
            }
        });
        logger_1.logger.info(`Lock released: ${resourceId} `);
    }
    catch (error) {
        logger_1.logger.error(`Error releasing lock ${resourceId} `, error);
    }
};
exports.releaseLock = releaseLock;
//# sourceMappingURL=locker.js.map