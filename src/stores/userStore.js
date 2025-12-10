import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

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
                    await userService.syncUser(user)
                    // You might want to get specific firestore data merging here
                    // For now, we keep the Auth User object primarily
                    this.user = user
                } else {
                    this.user = null
                }
                this.authReady = true
            })
        },

        /**
         * Register a new user
         */
        async register(email, password, displayName) {
            try {
                const credential = await authService.register(email, password, displayName)
                if (credential.user) {
                    this.user = credential.user
                    // Sync handled by onAuthStateChanged usually, but we can double check
                    await userService.syncUser(credential.user)
                }
            } catch (err) {
                console.error("Registration failed:", err.message)
                throw new Error(authService.mapAuthError(err.code))
            }
        },

        /**
         * Login with Email/Password
         */
        async login(email, password) {
            try {
                const credential = await authService.login(email, password)
                // this.user will be updated by initAuth listener
            } catch (err) {
                console.error("Login failed:", err.message)
                throw new Error(authService.mapAuthError(err.code))
            }
        },

        /**
         * Login with Google
         */
        async loginWithGoogle() {
            try {
                const credential = await authService.loginWithGoogle()
                // this.user will be updated by initAuth listener
            } catch (err) {
                if (err.code !== 'auth/popup-closed-by-user') {
                    console.error("Login failed:", err.message)
                }
                throw err
            }
        },

        /**
         * Update User Profile
         */
        async updateUserProfile(displayName, photoURL) {
            if (!this.user) return
            try {
                // 1. Update Auth
                await authService.updateProfile(this.user, displayName, photoURL)

                // 2. Update Firestore
                await userService.updateProfile(this.user.uid, displayName, photoURL)

                // 3. Force state refresh (Auth object is immutable-ish)
                // We rely on the object reference update or reload
                // A trick is to reload client or re-fetch. 
                // Creating a shallow copy to trigger reactivity:
                // Note: auth.currentUser is needed here if we rely on the underlying SDK to confirm update
                // But since we use service, we might assume success.
                // Ideally, onAuthStateChanged fires on token refresh, but not strictly on profile update.
                // We manually update local state:
                this.user = { ...this.user, displayName, photoURL }

            } catch (err) {
                console.error("Update profile error:", err)
                throw err
            }
        },

        /**
         * Logout
         */
        async logout() {
            await authService.logout()
            this.user = null
        }
    }
})
