import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

const functions = getFunctions()

export class WebAuthnService {
    /**
     * Register a new Passkey
     */
    async registerPasskey() {
        try {
            // 1. Get Options from Backend
            const getOptionsRef = httpsCallable(functions, 'webAuthnRegisterOptions')
            const optionsRes = await getOptionsRef()
            const options = optionsRes.data as any

            // 2. Browser API Call
            const credential = await startRegistration(options)

            // 3. Verify with Backend
            const verifyRef = httpsCallable(functions, 'webAuthnRegisterVerify')
            await verifyRef({ credential })

            return { success: true }
        } catch (error) {
            console.error('Passkey registration failed:', error)
            throw error
        }
    }

    /**
     * Sign In with Passkey
     */
    async signInWithPasskey() {
        try {
            // 1. Get Auth Options
            const getOptionsRef = httpsCallable(functions, 'webAuthnAuthOptions')
            const optionsRes = await getOptionsRef()
            const { options, sessionId } = optionsRes.data as any

            // 2. Browser API Call
            const credential = await startAuthentication(options)

            // 3. Verify and Get Token
            const verifyRef = httpsCallable(functions, 'webAuthnAuthVerify')
            const verifyRes = await verifyRef({ credential, sessionId })
            const { customToken } = verifyRes.data as any

            // 4. Firebase Auth Sign In
            const auth = getAuth()
            await signInWithCustomToken(auth, customToken)

            return { success: true }
        } catch (error) {
            console.error('Passkey sign-in failed:', error)
            throw error
        }
    }
}

export const webAuthnService = new WebAuthnService()
