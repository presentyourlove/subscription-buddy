import { vi } from 'vitest'

// Mock Firebase Messaging to prevent "unsupported browser" errors
vi.mock('firebase/messaging', () => ({
    getMessaging: vi.fn(),
    getToken: vi.fn(),
    onMessage: vi.fn()
}))

// Mock Firebase Analytics
vi.mock('firebase/analytics', () => ({
    getAnalytics: vi.fn(),
    logEvent: vi.fn(),
    isSupported: vi.fn().mockResolvedValue(false)
}))

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    deleteDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    addDoc: vi.fn(),
    onSnapshot: vi.fn(),
    connectFirestoreEmulator: vi.fn(),
    enableMultiTabIndexedDbPersistence: vi.fn().mockResolvedValue(undefined),
    initializeFirestore: vi.fn(() => ({}))
}))

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({ currentUser: null })),
    connectAuthEmulator: vi.fn(),
    onAuthStateChanged: vi.fn(),
    deleteUser: vi.fn()
}))

// Mock Firebase App
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApp: vi.fn(),
    getApps: vi.fn(() => [])
}))

// Mock Firebase App Check
vi.mock('firebase/app-check', () => ({
    initializeAppCheck: vi.fn(),
    ReCaptchaEnterpriseProvider: vi.fn()
}))
