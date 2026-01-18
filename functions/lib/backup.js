'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.scheduledFirestoreExport = void 0
const functions = require('firebase-functions')
const firestore_1 = require('@google-cloud/firestore')
const client = new firestore_1.v1.FirestoreAdminClient()
// Replace BUCKET_NAME in environment setup or use config
// firebase functions:config:set backup.bucket="YOUR_BUCKET_NAME"
exports.scheduledFirestoreExport = functions.pubsub
    .schedule('0 0 * * *') // Run every day at midnight
    .timeZone('Asia/Taipei') // Run in Taipei time
    .onRun(async (context) => {
        var _a
        const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
        const bucketName =
            ((_a = functions.config().backup) === null || _a === void 0
                ? void 0
                : _a.bucket) || process.env.BACKUP_BUCKET
        if (!bucketName) {
            console.error(
                'BUCKET_NAME configuration is missing. Set it via \'firebase functions:config:set backup.bucket="..."\''
            )
            return
        }
        const databaseName = client.databasePath(projectId, '(default)')
        console.log(
            `Exporting database ${databaseName} to bucket ${bucketName}`
        )
        try {
            const responses = await client.exportDocuments({
                name: databaseName,
                outputUriPrefix: `gs://${bucketName}/backup-${new Date().toISOString()}`,
                // Leave collectionIds empty to export all collections
                collectionIds: []
            })
            const response = responses[0]
            console.log(`Export operation started: ${response.name}`)
        } catch (err) {
            console.error('Export operation failed', err)
            throw new Error('Export operation failed')
        }
    })
//# sourceMappingURL=backup.js.map
