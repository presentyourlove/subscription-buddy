import { User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, getFirestore } from 'firebase/firestore'

// import { db } from '../firebase/config'
import { UserProfile } from '../types'
import { COLLECTIONS, DEFAULTS } from '../utils/constants'

/**
 * Service to handle User data in Firestore
 */
class UserService {
  get db() {
    return getFirestore()
  }

  static COLLECTION = COLLECTIONS.USERS

  /**
   * Sync Auth user data to Firestore
   */
  async syncUser(user: User): Promise<void> {
    if (!user) return
    const userRef = doc(this.db, UserService.COLLECTION, user.uid)

    try {
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          ratingSum: DEFAULTS.RATING_SUM,
          ratingCount: DEFAULTS.RATING_COUNT,
          createdAt: new Date()
        } as UserProfile)
      }
    } catch (err) {
      console.error('[UserService] Sync error:', err)
      throw err
    }
  }

  /**
   * Update user profile data in Firestore
   */
  async updateProfile(uid: string, displayName: string, photoURL: string): Promise<void> {
    if (!uid) return
    const userRef = doc(this.db, UserService.COLLECTION, uid)
    await updateDoc(userRef, {
      displayName,
      photoURL
    })
  }

  /**
   * Get user profile data
   */
  async getUser(uid: string): Promise<UserProfile | null> {
    if (!uid) return null
    const userRef = doc(this.db, UserService.COLLECTION, uid)
    const snap = await getDoc(userRef)
    return snap.exists() ? (snap.data() as UserProfile) : null
  }

  /**
   * Upload user's public key for E2EE
   */
  async uploadPublicKey(uid: string, publicKey: string): Promise<void> {
    const userRef = doc(this.db, UserService.COLLECTION, uid)
    await updateDoc(userRef, {
      publicKey
    })
  }
}

export const userService = new UserService()
