import { User } from 'firebase/auth'
import { defineStore } from 'pinia'

import { authService } from '../services/authService'
import { userService } from '../services/userService'
import type { Group } from '../types'
import { FIREBASE_AUTH_CODES } from '../utils/constants'

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
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('Registration failed:', message)
        // Check if err has code property
        const code = (err as { code?: string }).code
        if (code) {
          throw new Error(authService.mapAuthError(code))
        }
        throw err
      }
    },

    /**
     * Login with Email/Password
     */
    async login(email: string, password: string) {
      try {
        await authService.login(email, password)
        // this.user will be updated by initAuth listener
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('Login failed:', message)
        const code = (err as { code?: string }).code
        if (code) {
          throw new Error(authService.mapAuthError(code))
        }
        throw err
      }
    },

    /**
     * Login with Google
     */
    async loginWithGoogle() {
      try {
        await authService.loginWithGoogle()
        // this.user will be updated by initAuth listener
      } catch (err: unknown) {
        const code = (err as { code?: string }).code
        if (code !== FIREBASE_AUTH_CODES.POPUP_CLOSED) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('Login failed:', message)
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
      } catch (err: unknown) {
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
      } catch (err: unknown) {
        console.error('Logout failed:', err)
        throw err
      }
    },

    /**
     * Fetch user's hosted and joined group history
     */
    async fetchUserGroupHistory() {
      if (!this.user) return { hosted: [], joined: [] }

      try {
        const { db } = await import('../firebase/config')
        const { collection, query, where, getDocs, doc, getDoc } =
          await import('firebase/firestore')

        // 1. Hosted Groups
        const qHosted = query(collection(db, 'groups'), where('hostId', '==', this.user.uid))
        const snapHosted = await getDocs(qHosted)
        const hosted = snapHosted.docs.map((d) => ({ id: d.id, ...d.data() })) as Group[]

        // 2. Joined Chats -> Groups
        const qChats = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', this.user.uid)
        )
        const snapChats = await getDocs(qChats)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const joined: any[] = []
        for (const cDoc of snapChats.docs) {
          const groupId = cDoc.id
          // Skip if I am the host
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (hosted.find((g: any) => g.id === groupId)) continue

          try {
            const gRef = doc(db, 'groups', groupId)
            const gSnap = await getDoc(gRef)
            if (gSnap.exists()) {
              joined.push({ id: gSnap.id, ...gSnap.data() } as Group)
            }
          } catch (innerErr) {
            console.warn('Skipping invalid group ref:', groupId, innerErr)
          }
        }

        return { hosted, joined }
      } catch (err: unknown) {
        console.error('Fetch user history error:', err)
        throw err
      }
    }
  }
})
