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

// Mock Firebase Auth (optional, if needed globally)
// vi.mock('firebase/auth', () => ({
//   getAuth: vi.fn(() => ({ currentUser: null })),
//   connectAuthEmulator: vi.fn()
// }))
