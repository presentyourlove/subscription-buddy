import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS, DEFAULTS } from '../utils/constants';
/**
 * Service to handle User data in Firestore
 */
class UserService {
    static COLLECTION = COLLECTIONS.USERS;
    /**
     * Sync Auth user data to Firestore
     */
    async syncUser(user) {
        if (!user)
            return;
        const userRef = doc(db, UserService.COLLECTION, user.uid);
        try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    ratingSum: DEFAULTS.RATING_SUM,
                    ratingCount: DEFAULTS.RATING_COUNT,
                    createdAt: new Date()
                });
            }
        }
        catch (err) {
            console.error('[UserService] Sync error:', err);
            throw err;
        }
    }
    /**
     * Update user profile data in Firestore
     */
    async updateProfile(uid, displayName, photoURL) {
        if (!uid)
            return;
        const userRef = doc(db, UserService.COLLECTION, uid);
        await updateDoc(userRef, {
            displayName,
            photoURL
        });
    }
    /**
     * Get user profile data
     */
    async getUser(uid) {
        if (!uid)
            return null;
        const userRef = doc(db, UserService.COLLECTION, uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data() : null;
    }
}
export const userService = new UserService();
//# sourceMappingURL=userService.js.map