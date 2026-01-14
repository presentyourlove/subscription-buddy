import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase/config';
export const requestNotificationPermission = async (uid) => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // User needs to add this to .env
            });
            // TODO: Save token to Firestore users/{uid}/fcmTokens
            return token;
        }
        else {
            // Permission denied
        }
    }
    catch (error) {
        console.error('An error occurred while retrieving token. ', error);
    }
};
//# sourceMappingURL=notificationService.js.map