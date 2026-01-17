import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore
} from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const messaging = getMessaging(app)

// Connect to Emulators in development mode
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  console.info('🔧 Firebase Emulators connected (Auth: 9099, Firestore: 8080)')


}

// Enable Offline Persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn(
      'Persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a a time.'
    )
  } else if (err.code == 'unimplemented') {
    console.warn('Persistence failed: The current browser does not support all of the features required to enable persistence')
  }
})

import { getAnalytics, isSupported } from 'firebase/analytics'
let analytics: ReturnType<typeof getAnalytics> | null = null

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app)
  }
})

export { analytics, auth, db, messaging }
