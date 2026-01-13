import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase/config'

export const requestNotificationPermission = async (uid: string): Promise<string | undefined> => {
    try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // User needs to add this to .env
            })
            console.log('FCM Token:', token)
            // TODO: Save token to Firestore users/{uid}/fcmTokens
            return token
        } else {
            console.log('Unable to get permission to notify.')
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error)
    }
}
