"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onChatWrite = exports.onGroupWrite = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
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
    let action = "UNKNOWN";
    if (!beforeData && afterData)
        action = "CREATE";
    else if (beforeData && afterData)
        action = "UPDATE";
    else if (beforeData && !afterData)
        action = "DELETE";
    // Don't log if no change
    if (action === "UNKNOWN")
        return null;
    const auditEntry = {
        action,
        collection: collectionName,
        docId,
        eventId,
        timestamp: admin.firestore.Timestamp.parse(timestamp),
        user: auth ? { uid: auth.uid, token: auth.token } : "SYSTEM/UNAUTH",
        diff: {
            before: beforeData,
            after: afterData,
        },
        metadata: {
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
    };
    try {
        await db.collection("audit_logs").add(auditEntry);
        console.log(`Audit log created for ${collectionName}/${docId} (${action})`);
    }
    catch (error) {
        console.error(`Failed to create audit log for ${collectionName}/${docId}:`, error);
    }
};
exports.onGroupWrite = functions.firestore
    .document("groups/{docId}")
    .onWrite((change, context) => createAuditLog(change, context, "groups"));
exports.onChatWrite = functions.firestore
    .document("chats/{docId}")
    .onWrite((change, context) => createAuditLog(change, context, "chats"));
//# sourceMappingURL=index.js.map