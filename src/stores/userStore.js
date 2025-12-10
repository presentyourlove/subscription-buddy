import { defineStore } from 'pinia'
import { auth } from '../firebase/config'
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        authReady: false
    }),
    actions: {
        initAuth() {
            onAuthStateChanged(auth, (user) => {
                this.user = user
                this.authReady = true
            })
        },
        async loginWithGoogle() {
            const provider = new GoogleAuthProvider()
            try {
                const res = await signInWithPopup(auth, provider)
                if (res) {
                    this.user = res.user
                }
            } catch (err) {
                console.error("Login failed:", err.message)
                throw err
            }
        },
        async logout() {
            await signOut(auth)
            this.user = null
        }
    }
})
