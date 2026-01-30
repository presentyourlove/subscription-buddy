import { getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useFirestore, useCurrentUser } from 'vuefire'

// TODO: messaging 需要在 nuxt-vuefire 中額外設定
// 暫時註解掉相關功能，待完成 Firebase Messaging 設定後再啟用

export const notificationService = {
    /**
     * Request notification permission and save token to Firestore
     */
    async requestPermission(): Promise<string | null> {
        // TODO: 實作 Firebase Messaging
        console.warn('Firebase Messaging not configured yet')
        return null
        /* COMMENTED OUT - needs Firebase Messaging setup
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
        */
    },

    /**
     * Save FCM token to user's subcollection
     */
    async saveToken(token: string) {
        const db = useFirestore()
        const user = useCurrentUser()
        if (!user.value) return

        const tokenRef = doc(db, 'users', user.value.uid, 'fcmTokens', token)
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
        // TODO: 實作 Firebase Messaging
        console.warn('Firebase Messaging not configured yet')
        return
        /* COMMENTED OUT - needs Firebase Messaging setup
        if (!messaging) return
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload)
            callback(payload)
        })
        */
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
