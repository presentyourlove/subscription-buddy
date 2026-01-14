import { signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FIREBASE_AUTH_CODES } from '../utils/constants';
/**
 * Service to handle Firebase Authentication
 */
class AuthService {
    /**
     * Monitor authentication state
     */
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
    /**
     * Register a new user with email and password
     */
    async register(email, password, displayName) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (credential.user) {
            await updateProfile(credential.user, { displayName });
        }
        return credential;
    }
    /**
     * Login with email and password
     */
    async login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    /**
     * Login with Google Popup
     */
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }
    /**
     * Logout current user
     */
    async logout() {
        return signOut(auth);
    }
    /**
     * Update current user profile
     */
    async updateProfile(user, displayName, photoURL) {
        return updateProfile(user, { displayName, photoURL });
    }
    /**
     * Map Firebase error codes to human readable strings
     */
    mapAuthError(code) {
        switch (code) {
            case FIREBASE_AUTH_CODES.EMAIL_IN_USE:
                return 'auth.error.emailInUse';
            case FIREBASE_AUTH_CODES.INVALID_EMAIL:
                return 'auth.error.invalidEmail';
            case FIREBASE_AUTH_CODES.WEAK_PASSWORD:
                return 'auth.error.weakPassword';
            case FIREBASE_AUTH_CODES.USER_NOT_FOUND:
                return 'auth.error.userNotFound';
            case FIREBASE_AUTH_CODES.WRONG_PASSWORD:
                return 'auth.error.wrongPassword';
            case FIREBASE_AUTH_CODES.POPUP_CLOSED:
                return 'auth.error.popupClosed';
            default:
                return code;
        }
    }
}
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map