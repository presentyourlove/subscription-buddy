import { PubSub } from '@google-cloud/pubsub'
import { logger } from './logger'

const pubSubClient = new PubSub()

export const Topics = {
    USER_REGISTERED: 'user.registered',
    GROUP_CREATED: 'group.created',
    GROUP_JOINED: 'group.joined'
}

/**
 * Publishes an event to a specific topic.
 * @param topicName The name of the topic (use Topics enum)
 * @param data The JSON data to publish
 */
export const publishEvent = async (topicName: string, data: Record<string, any>) => {
    try {
        const dataBuffer = Buffer.from(JSON.stringify(data))
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer })
        logger.info(`Message ${messageId} published to ${topicName}`)
        return messageId
    } catch (error) {
        logger.error(`Error publishing to ${topicName}`, error)
        throw error
    }
}
