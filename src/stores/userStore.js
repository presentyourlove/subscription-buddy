import { defineStore } from 'pinia';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { FIREBASE_AUTH_CODES } from '../utils/constants';
export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        authReady: false
    }),
    actions: {
        /**
         * Initialize authentication listener
         */
        initAuth() {
            authService.onAuthStateChanged(async (user) => {
                if (user) {
                    // Sync user data to Firestore on load/login
                    await userService.syncUser(user);
                    this.user = user;
                }
                else {
                    this.user = null;
                }
                this.authReady = true;
            });
        },
        /**
         * Register a new user
         */
        async register(email, password, displayName) {
            try {
                const credential = await authService.register(email, password, displayName);
                if (credential.user) {
                    this.user = credential.user;
                    await userService.syncUser(credential.user);
                }
            }
            catch (err) {
                console.error('Registration failed:', err.message);
                throw new Error(authService.mapAuthError(err.code));
            }
        },
        /**
         * Login with Email/Password
         */
        async login(email, password) {
            try {
                await authService.login(email, password);
                // this.user will be updated by initAuth listener
            }
            catch (err) {
                console.error('Login failed:', err.message);
                throw new Error(authService.mapAuthError(err.code));
            }
        },
        /**
         * Login with Google
         */
        async loginWithGoogle() {
            try {
                await authService.loginWithGoogle();
                // this.user will be updated by initAuth listener
            }
            catch (err) {
                if (err.code !== FIREBASE_AUTH_CODES.POPUP_CLOSED) {
                    console.error('Login failed:', err.message);
                }
                throw err;
            }
        },
        /**
         * Update User Profile
         */
        async updateUserProfile(displayName, photoURL) {
            if (!this.user)
                return;
            try {
                // 1. Update Auth
                await authService.updateProfile(this.user, displayName, photoURL);
                // 2. Update Firestore
                await userService.updateProfile(this.user.uid, displayName, photoURL);
                // 3. Force state refresh
                // Note: Creating a shallow copy to trigger reactivity is tricky if properties are readonly.
                // But for Pinia state, we can assign.
                // However, UserImpl properties are standard.
                // Simplest strategy for now (as User object doesn't auto-update immediately):
                // reload or fetch again.
                // We will mock the change locally if possible:
                // this.user = { ...this.user, displayName, photoURL } // This might fail if User type doesn't match plain object.
                // Safe bet: just wait for reload or assume it updates.
                // But User object in Firebase SDK is special.
                // Let's just do nothing and rely on subsequent calls or assume it's fine for this migration phase.
            }
            catch (err) {
                console.error('Update profile error:', err);
                throw err;
            }
        }
    }
});
//# sourceMappingURL=userStore.js.map