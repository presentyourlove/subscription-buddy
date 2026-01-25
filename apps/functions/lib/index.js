"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.onChatWrite = exports.onGroupWrite = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const server_1 = require("./api/server");
const logger_1 = require("./utils/logger");
admin.initializeApp();
const db = admin.firestore();
/**
 * Creates an audit log entry for Firestore document changes.
 * @param change - The Change object from the trigger.
 * @param context - The EventContext from the trigger.
 * @param collectionName - The name of the collection being monitored.
 */
const createAuditLog = async (change, context, collectionName) => {
    const { eventId, timestamp, params, auth } = context;
    const docId = params.docId;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;
    let action = 'UNKNOWN';
    if (!beforeData && afterData)
        action = 'CREATE';
    else if (beforeData && afterData)
        action = 'UPDATE';
    else if (beforeData && !afterData)
        action = 'DELETE';
    // Don't log if no change
    if (action === 'UNKNOWN')
        return null;
    const auditEntry = {
        action,
        collection: collectionName,
        docId,
        eventId,
        timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
        user: auth ? { uid: auth.uid, token: auth.token } : 'SYSTEM/UNAUTH',
        diff: {
            before: beforeData,
            after: afterData
        },
        metadata: {
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
    };
    try {
        await db.collection('audit_logs').add(auditEntry);
        logger_1.logger.info(`Audit log created for ${collectionName}/${docId} (${action})`, {
            severity: 'INFO',
            collection: collectionName,
            docId,
            action,
            // Log the diff for debugging, knowing it will be masked by logger
            diff: auditEntry.diff
        });
    }
    catch (error) {
        logger_1.logger.error(`Failed to create audit log for ${collectionName}/${docId}`, error);
    }
    return null;
};
exports.onGroupWrite = functions.firestore
    .document('groups/{docId}')
    .onWrite((change, context) => createAuditLog(change, context, 'groups'));
exports.onChatWrite = functions.firestore
    .document('chats/{docId}')
    .onWrite((change, context) => createAuditLog(change, context, 'chats'));
exports.api = functions.https.onRequest(server_1.apiApp);
//# sourceMappingURL=index.js.map