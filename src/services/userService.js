import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Service to handle User data in Firestore
 * 
 * Why: Separates the persistence layer (Firestore) from the state management (Pinia).
 * Ensures that user profile operations are centralized and consistent.
 */
class UserService {
    /**
     * Collection Name
     * Why: Centralized constant prevents typo errors across methods.
     */
    static COLLECTION = 'users'

    /**
     * Sync Auth user data to Firestore
     * Creates document if it doesn't exist.
     * @param {import('firebase/auth').User} user 
     * @returns {Promise<void>}
     */
    async syncUser(user) {
        if (!user) return
        const userRef = doc(db, UserService.COLLECTION, user.uid)

        try {
            const userSnap = await getDoc(userRef)
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    ratingSum: 0,
                    ratingCount: 0,
                    createdAt: new Date()
                })
            }
            // Optional: Update basic info on every login if needed
            // else { await updateDoc(userRef, { ... }) }
        } catch (err) {
            console.error('[UserService] Sync error:', err)
            throw err
        }
    }

    /**
     * Update user profile data in Firestore
     * @param {string} uid 
     * @param {string} displayName 
     * @param {string} photoURL 
     * @returns {Promise<void>}
     */
    async updateProfile(uid, displayName, photoURL) {
        if (!uid) return
        const userRef = doc(db, UserService.COLLECTION, uid)
        await updateDoc(userRef, {
            displayName,
            photoURL
        })
    }

    /**
     * Get user profile data
     * @param {string} uid 
     * @returns {Promise<object|null>}
     */
    async getUser(uid) {
        if (!uid) return null
        const userRef = doc(db, UserService.COLLECTION, uid)
        const snap = await getDoc(userRef)
        return snap.exists() ? snap.data() : null
    }
}

export const userService = new UserService()
