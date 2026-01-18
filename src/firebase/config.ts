import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore
} from 'firebase/firestore'
import { getMessaging, Messaging } from 'firebase/messaging'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getAnalytics, isSupported } from 'firebase/analytics'

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

// Initialize Messaging (Client-side only)
let messaging: Messaging | null = null
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app)
  } catch (err) {
    console.warn('Firebase Messaging not supported in this environment')
  }
}

// Initialize App Check (Client-side only)
if (typeof window !== 'undefined') {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  if (siteKey) {
    if (import.meta.env.VITE_USE_EMULATOR === 'true') {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    })
  }
}

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
    console.warn(
      'Persistence failed: The current browser does not support all of the features required to enable persistence'
    )
  }
})

// Initialize Analytics
let analytics: ReturnType<typeof getAnalytics> | null = null

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app)
  }
})

export { analytics, auth, db, messaging }
