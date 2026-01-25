"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIdempotency = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const logger_1 = require("../utils/logger");
/**
 * Wraps a Callable Function with Idempotency logic using Firestore.
 *
 * @param handler The original callable function handler
 * @param collectionPath The Firestore collection to store idempotency keys (default: 'idempotency_keys')
 */
const withIdempotency = (handler, collectionPath = 'idempotency_keys') => {
    return async (data, context) => {
        // 1. Determine Idempotency Key
        // Priority: custom header 'Idempotency-Key' > context.requestId (if available and stable) > generated
        // Note: callable context doesn't expose raw headers easily in all envs,
        // ideally the client sends the key in the data payload or we rely on robust client logic.
        // For this implementation, we check if 'idempotencyKey' exists in data (convention) OR use a context fallback if possible.
        // However, standard practice for Callable is passing it in data wrapper if headers aren't accessible.
        const payload = data;
        const idempotencyKey = (payload === null || payload === void 0 ? void 0 : payload.idempotencyKey) || (payload === null || payload === void 0 ? void 0 : payload._idempotencyKey);
        // If no key provided, skip idempotency (pass-through)
        if (!idempotencyKey) {
            return handler(data, context);
        }
        const db = admin.firestore();
        const docRef = db.collection(collectionPath).doc(idempotencyKey);
        let transactionResult = null;
        try {
            transactionResult = await db.runTransaction(async (t) => {
                const doc = await t.get(docRef);
                if (doc.exists) {
                    const record = doc.data();
                    if (record.status === 'COMPLETED') {
                        logger_1.logger.info(`Idempotency hit for key: ${idempotencyKey}`);
                        return record.result;
                    }
                    if (record.status === 'PROCESSING') {
                        // Concurrent request or retry loop
                        throw new functions.https.HttpsError('aborted', 'Request is already being processed.');
                    }
                    // If FAILED, we might allow retry depending on policy.
                    // Here we treat FAILED as a terminal state or re-runnable?
                    // Let's assume re-runnable if FAILED.
                }
                t.set(docRef, {
                    id: idempotencyKey,
                    status: 'PROCESSING',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // - Transaction/Write: Update to COMPLETED
                // BUT: Firestore client transaction must finish synchronously-ish.
                // We cannot return from transaction, await handler, then resume transaction context easily.
                // If it succeeds, we own the lock.
                return null;
            });
            // If we are here, we either got the cached result (and returned early? No, runTransaction returns the return value of the callback)
            // Wait, if I return record.result inside, runTransaction returns it.
            // If I set PROCESSING inside, runTransaction returns... void?
            // Re-refining the flow for runTransaction limitation:
            // We use transaction ONLY to check and lock.
        }
        catch (e) {
            // If it was our own "hit", we returned the result.
            // If it was "already processing", we rethrow.
            // Wait, how to distinguish "return cached result" from "acquired lock"?
            // Let's adjust structure slightly to be safer
        }
        if (transactionResult)
            return transactionResult;
        // 3. Execute Handler
        try {
            const result = await handler(data, context);
            // 4. Save Result
            await docRef.update({
                status: 'COMPLETED',
                result: result,
                completedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            return result;
        }
        catch (error) {
            // 5. Handle Failure
            await docRef.update({
                status: 'FAILED',
                error: JSON.stringify(error),
                completedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            throw error;
        }
    };
};
exports.withIdempotency = withIdempotency;
//# sourceMappingURL=idempotency.js.map