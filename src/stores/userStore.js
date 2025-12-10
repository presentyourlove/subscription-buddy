import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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

        async syncUserToFirestore(user) {
            if (!user) return
            const userRef = doc(db, 'users', user.uid)
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
                } else {
                    // Update basic info if changed (optional)
                    // await updateDoc(userRef, { displayName: user.displayName, photoURL: user.photoURL })
                }
            } catch (err) {
                console.error("Sync user error:", err)
            }
        },
        async register(email, password, displayName) {
            try {
                const res = await createUserWithEmailAndPassword(auth, email, password)
                if (res) {
                    this.user = res.user
                    await updateProfile(res.user, { displayName })
                    // Retrieve updated user object or manually construct
                    const updatedUser = { ...res.user, displayName }
                    this.user = updatedUser
                    await this.syncUserToFirestore(updatedUser)
                }
            } catch (err) {
                console.error("Registration failed:", err.message)
                throw new Error(this.mapAuthError(err.code))
            }
        },
        async login(email, password) {
            try {
                const res = await signInWithEmailAndPassword(auth, email, password)
                if (res) {
                    this.user = res.user
                    await this.syncUserToFirestore(res.user)
                }
            } catch (err) {
                console.error("Login failed:", err.message)
                throw new Error(this.mapAuthError(err.code))
            }
        },
        async loginWithGoogle() {
            const provider = new GoogleAuthProvider()
            try {
                const res = await signInWithPopup(auth, provider)
                if (res) {
                    this.user = res.user
                    await this.syncUserToFirestore(res.user)
                }
            } catch (err) {
                console.error("Login failed:", err.message)
                throw err
            }
        },
        async updateUserProfile(displayName, photoURL) {
            if (!this.user) return
            try {
                // 1. Update Firebase Auth
                await updateProfile(this.user, { displayName, photoURL })

                // 2. Force state update
                this.user = { ...auth.currentUser }

                // 3. Update Firestore 'users' doc
                const userRef = doc(db, 'users', this.user.uid)
                await updateDoc(userRef, {
                    displayName,
                    photoURL
                })
            } catch (err) {
                console.error("Update profile error:", err)
                throw err
            }
        },
        async logout() {
            await signOut(auth)
            this.user = null
        },
        mapAuthError(code) {
            switch (code) {
                case 'auth/email-already-in-use': return '此 Email 已被註冊'
                case 'auth/invalid-email': return 'Email 格式不正確'
                case 'auth/weak-password': return '密碼強度不足 (至少 6 字元)'
                case 'auth/user-not-found': return '找不到此使用者'
                case 'auth/wrong-password': return '密碼錯誤'
                default: return '發生錯誤: ' + code
            }
        }
    }
})
