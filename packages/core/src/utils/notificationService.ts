import { getToken, getMessaging } from 'firebase/messaging'

// import { messaging } from '../firebase/config'

/**
 * Request notification permission and get FCM token
 * @param vapidKey - VAPID key for web push (from Firebase Console)
 * @returns FCM token if permission granted, undefined otherwise
 */
export const requestNotificationPermission = async (vapidKey: string): Promise<string | undefined> => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const messaging = getMessaging()
      if (messaging) {
        const token = await getToken(messaging, { vapidKey })
        // TODO: Save token to Firestore users/{uid}/fcmTokens
        return token
      }
    } else {
      // Permission denied
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error)
  }
}

