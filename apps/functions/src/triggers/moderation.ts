import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import { logger } from '../utils/logger'

const vision = new ImageAnnotatorClient()

/**
 * Triggers when a new image is uploaded to Storage.
 * Scans for SafeSearch violations (Adult, Violence, Racy).
 */
export const scanImage = functions.storage.object().onFinalize(async (object) => {
    const bucketName = object.bucket
    const fileName = object.name

    if (!fileName) return

    // Skip already scanned images or other non-image files if needed
    if (!fileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
        logger.info(`Skipping non-image file: ${fileName}`)
        return
    }

    const gcsPath = `gs://${bucketName}/${fileName}`
    logger.info(`Scanning image for content moderation: ${gcsPath}`)

    try {
        const [result] = await vision.safeSearchDetection(gcsPath)
        const detections = result.safeSearchAnnotation

        if (!detections) {
            logger.info(`No safe search annotations found for ${fileName}`)
            return
        }

        const isUnsafe =
            detections.adult === 'LIKELY' ||
            detections.adult === 'VERY_LIKELY' ||
            detections.violence === 'LIKELY' ||
            detections.violence === 'VERY_LIKELY' ||
            detections.racy === 'LIKELY' ||
            detections.racy === 'VERY_LIKELY'

        if (isUnsafe) {
            logger.warn(`Unsafe content detected in ${fileName}`, detections)

            // Action: Delete the file or move to quarantine
            const bucket = admin.storage().bucket(bucketName)
            await bucket.file(fileName).delete()

            logger.info(`Deleted unsafe file: ${fileName}`)

            // Audit Log
            await admin.firestore().collection('audit_logs').add({
                action: 'MODERATION_DELETE',
                resource: fileName,
                reason: detections,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            })
        } else {
            logger.info(`Image ${fileName} passed safety check`)
        }

    } catch (error) {
        logger.error(`Error processing image ${fileName}`, error)
    }
})
