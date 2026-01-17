import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

const db = admin.firestore()

/**
 * Creates an audit log entry for Firestore document changes.
 * @param change - The Change object from the trigger.
 * @param context - The EventContext from the trigger.
 * @param collectionName - The name of the collection being monitored.
 */
const createAuditLog = async (
    change: functions.Change<functions.firestore.DocumentSnapshot>,
    context: functions.EventContext,
    collectionName: string
) => {
    const { eventId, timestamp, params, auth } = context
    const docId = params.docId

    const beforeData = change.before.exists ? change.before.data() : null
    const afterData = change.after.exists ? change.after.data() : null

    let action = 'UNKNOWN'
    if (!beforeData && afterData) action = 'CREATE'
    else if (beforeData && afterData) action = 'UPDATE'
    else if (beforeData && !afterData) action = 'DELETE'

    // Don't log if no change
    if (action === 'UNKNOWN') return null

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
    }

    try {
        await db.collection('audit_logs').add(auditEntry)
        console.log(
            JSON.stringify({
                severity: 'INFO',
                message: `Audit log created for ${collectionName}/${docId} (${action})`,
                collection: collectionName,
                docId,
                action
            })
        )
    } catch (error) {
        console.error(
            JSON.stringify({
                severity: 'ERROR',
                message: `Failed to create audit log for ${collectionName}/${docId}`,
                error: error instanceof Error ? error.message : String(error)
            })
        )
    }
    return null
}

export const onGroupWrite = functions.firestore
    .document('groups/{docId}')
    .onWrite((change, context) => createAuditLog(change, context, 'groups'))

export const onChatWrite = functions.firestore
    .document('chats/{docId}')
    .onWrite((change, context) => createAuditLog(change, context, 'chats'))
