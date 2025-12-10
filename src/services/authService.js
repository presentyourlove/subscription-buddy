import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/config'

/**
 * Service to handle Firebase Authentication
 * 
 * Why: Decouples the application logic from the specific backend implementation (Firebase).
 * Allows for easier testing and potential future swapping of auth providers.
 * Follows the Single Responsibility Principle by isolating auth concerns.
 */
class AuthService {
    /**
     * Monitor authentication state
     * 
     * Why: Firebase auth state is asynchronous. We need a reliable listener 
     * to trigger UI updates and state synchronization immediately upon login/logout.
     * 
     * @param {function} callback - Function to call on state change
     */
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback)
    }

    /**
     * Register a new user with email and password
     * @param {string} email 
     * @param {string} password 
     * @param {string} displayName 
     * @returns {Promise<import('firebase/auth').UserCredential>}
     */
    async register(email, password, displayName) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        if (credential.user) {
            await updateProfile(credential.user, { displayName })
        }
        return credential
    }

    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<import('firebase/auth').UserCredential>}
     */
    async login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    /**
     * Login with Google Popup
     * @returns {Promise<import('firebase/auth').UserCredential>}
     */
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }

    /**
     * Logout current user
     * @returns {Promise<void>}
     */
    async logout() {
        return signOut(auth)
    }

    /**
     * Update current user profile
     * @param {import('firebase/auth').User} user 
     * @param {string} displayName 
     * @param {string} photoURL 
     * @returns {Promise<void>}
     */
    async updateProfile(user, displayName, photoURL) {
        return updateProfile(user, { displayName, photoURL })
    }

    /**
     * Map Firebase error codes to human readable strings
     * @param {string} code - Firebase error code
     * @returns {string} Localized error key or message
     */
    mapAuthError(code) {
        // In Phase 4 we will return i18n keys here.
        // For now returning static strings to maintain functionality.
        switch (code) {
            case 'auth/email-already-in-use': return 'auth.error.emailInUse'
            case 'auth/invalid-email': return 'auth.error.invalidEmail'
            case 'auth/weak-password': return 'auth.error.weakPassword'
            case 'auth/user-not-found': return 'auth.error.userNotFound'
            case 'auth/wrong-password': return 'auth.error.wrongPassword'
            case 'auth/popup-closed-by-user': return 'auth.error.popupClosed'
            default: return code
        }
    }
}

export const authService = new AuthService()
