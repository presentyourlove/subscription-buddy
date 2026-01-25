import * as admin from 'firebase-admin'
import { logger } from '../utils/logger'

export class PushService {
    /**
     * Send a multicast message to all devices of a user.
     * @param userId The UID of the target user
     * @param payload The notification payload (title, body, data)
     */
    static async sendToUser(
        userId: string,
        payload: { title: string; body: string; data?: Record<string, string>; url?: string }
    ): Promise<void> {
        try {
            // 1. Fetch all tokens for the user
            const tokensSnapshot = await admin.firestore()
                .collection('users')
                .doc(userId)
                .collection('fcmTokens')
                .get()

            if (tokensSnapshot.empty) {
                logger.info(`No FCM tokens found for user ${userId}`)
                return
            }

            const tokens = tokensSnapshot.docs.map(doc => doc.id) // Doc ID is the token

            // 2. Construct message
            const message: admin.messaging.MulticastMessage = {
                tokens,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: {
                    ...payload.data,
                    url: payload.url || '/'
                },
                webpush: {
                    fcmOptions: {
                        link: payload.url || '/'
                    }
                }
            }

            // 3. Send multicast
            const response = await admin.messaging().sendEachForMulticast(message)

            // 4. Cleanup invalid tokens
            if (response.failureCount > 0) {
                const failedTokens: string[] = []
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx])
                    }
                })

                await Promise.all(failedTokens.map(token =>
                    admin.firestore()
                        .collection('users')
                        .doc(userId)
                        .collection('fcmTokens')
                        .doc(token)
                        .delete()
                ))
                logger.info(`Cleaned up ${failedTokens.length} invalid tokens for user ${userId}`)
            }

            logger.info(`Sent push notification to ${response.successCount} devices for user ${userId}`)

        } catch (error) {
            logger.error(`Failed to send push to user ${userId}`, error)
        }
    }
}
