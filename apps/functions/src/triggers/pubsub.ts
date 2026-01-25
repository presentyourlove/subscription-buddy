import * as functions from 'firebase-functions'
import { logger } from '../utils/logger'
import { Topics } from '../utils/pubsub'

/**
 * Triggered when a new group is created.
 * Handles side effects like sending confirmation emails or indexing.
 */
export const onGroupCreated = functions.pubsub.topic(Topics.GROUP_CREATED).onPublish(async (message) => {
    try {
        const data = message.json
        logger.info('Received group.created event', { groupId: data.groupId, title: data.title })

        // 1. Example: Send Email (Mock)
        // await emailService.sendGroupConfirmation(data.creatorId, data.groupId)
        logger.info(`[Mock] Email sent to creator of group ${data.groupId}`)

        // 2. Example: Update Search Index (Mock)
        // await searchIndex.saveObject(data)
        logger.info(`[Mock] Group ${data.groupId} indexed in Search Engine`)

    } catch (error) {
        logger.error('Error processing group.created event', error)
        // Configure retry logic in Google Cloud Console if needed
    }
})
