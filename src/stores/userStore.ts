import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { FIREBASE_AUTH_CODES } from '../utils/constants'
import { User } from 'firebase/auth'

interface UserState {
  user: User | null
  authReady: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
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
    async register(email: string, password: string, displayName: string) {
      try {
        const credential = await authService.register(email, password, displayName)
        if (credential.user) {
          this.user = credential.user
          await userService.syncUser(credential.user)
        }
      } catch (err: any) {
        console.error('Registration failed:', err.message)
        throw new Error(authService.mapAuthError(err.code))
      }
    },

    /**
     * Login with Email/Password
     */
    async login(email: string, password: string) {
      try {
        await authService.login(email, password)
        // this.user will be updated by initAuth listener
      } catch (err: any) {
        console.error('Login failed:', err.message)
        throw new Error(authService.mapAuthError(err.code))
      }
    },

    /**
     * Login with Google
     */
    async loginWithGoogle() {
      try {
        await authService.loginWithGoogle()
        // this.user will be updated by initAuth listener
      } catch (err: any) {
        if (err.code !== FIREBASE_AUTH_CODES.POPUP_CLOSED) {
          console.error('Login failed:', err.message)
        }
        throw err
      }
    },

    /**
     * Update User Profile
     */
    async updateUserProfile(displayName: string, photoURL: string) {
      if (!this.user) return
      try {
        // 1. Update Auth
        await authService.updateProfile(this.user, displayName, photoURL)

        // 2. Update Firestore
        await userService.updateProfile(this.user.uid, displayName, photoURL)
      } catch (err) {
        console.error('Update profile error:', err)
        throw err
      }
    },

    /**
     * Logout the current user
     */
    async logout() {
      try {
        await authService.logout()
        this.user = null
      } catch (err) {
        console.error('Logout failed:', err)
        throw err
      }
    }
  }
})
