import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
  NextOrObserver
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { FIREBASE_AUTH_CODES } from '../utils/constants'

/**
 * Service to handle Firebase Authentication
 */
class AuthService {
  /**
   * Monitor authentication state
   */
  onAuthStateChanged(callback: NextOrObserver<User>) {
    return onAuthStateChanged(auth, callback)
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, displayName: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (credential.user) {
      await updateProfile(credential.user, { displayName })
    }
    return credential
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password)
  }

  /**
   * Login with Google Popup
   */
  async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    return signOut(auth)
  }

  /**
   * Update current user profile
   */
  async updateProfile(user: User, displayName: string, photoURL: string): Promise<void> {
    return updateProfile(user, { displayName, photoURL })
  }

  /**
   * Map Firebase error codes to human readable strings
   */
  mapAuthError(code: string): string {
    switch (code) {
      case FIREBASE_AUTH_CODES.EMAIL_IN_USE:
        return 'auth.error.emailInUse'
      case FIREBASE_AUTH_CODES.INVALID_EMAIL:
        return 'auth.error.invalidEmail'
      case FIREBASE_AUTH_CODES.WEAK_PASSWORD:
        return 'auth.error.weakPassword'
      case FIREBASE_AUTH_CODES.USER_NOT_FOUND:
        return 'auth.error.userNotFound'
      case FIREBASE_AUTH_CODES.WRONG_PASSWORD:
        return 'auth.error.wrongPassword'
      case FIREBASE_AUTH_CODES.POPUP_CLOSED:
        return 'auth.error.popupClosed'
      default:
        return code
    }
  }
}

export const authService = new AuthService()
