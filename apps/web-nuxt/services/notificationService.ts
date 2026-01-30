import { getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { messaging, db, auth } from '../firebase/config'

export const notificationService = {
    /**
     * Request notification permission and save token to Firestore
     */
    async requestPermission(): Promise<string | null> {
        if (!messaging) return null

        try {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // Optional, or use manifest
                })

                if (token) {
                    await this.saveToken(token)
                    return token
                }
            }
        } catch (error) {
            console.error('Unable to get permission or token', error)
        }
        return null
    },

    /**
     * Save FCM token to user's subcollection
     */
    async saveToken(token: string) {
        const user = auth.currentUser
        if (!user) return

        const tokenRef = doc(db, 'users', user.uid, 'fcmTokens', token)
        await setDoc(tokenRef, {
            token,
            deviceType: this.getDeviceType(),
            lastUsedAt: serverTimestamp()
        }, { merge: true })
    },

    /**
     * Listen for foreground messages
     */
    onForegroundMessage(callback: (payload: any) => void) {
        if (!messaging) return
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload)
            callback(payload)
        })
    },

    getDeviceType(): string {
        const ua = navigator.userAgent
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet'
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile'
        }
        return 'desktop'
    }
}
