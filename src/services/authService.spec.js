import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import * as firebaseAuth from 'firebase/auth';
// Mock Firebase Auth module
vi.mock('firebase/auth', () => {
    return {
        getAuth: vi.fn(),
        signInWithPopup: vi.fn(),
        GoogleAuthProvider: vi.fn(),
        signOut: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
        updateProfile: vi.fn(),
        onAuthStateChanged: vi.fn(),
        User: vi.fn(),
        UserCredential: vi.fn()
    };
});
// Mock firebase config
vi.mock('../firebase/config', () => {
    return {
        auth: {}
    };
});
describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('register', () => {
        it('should create user and update profile', async () => {
            const mockUser = { uid: '123' };
            const mockCredential = { user: mockUser };
            vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue(mockCredential);
            vi.mocked(firebaseAuth.updateProfile).mockResolvedValue(undefined);
            const result = await authService.register('test@test.com', '123456', 'Test User');
            expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
            expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
            expect(result).toBe(mockCredential);
        });
    });
    describe('login', () => {
        it('should sign in with email and password', async () => {
            const mockCredential = { user: { uid: '123' } };
            vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue(mockCredential);
            const result = await authService.login('test@test.com', '123456');
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
            expect(result).toBe(mockCredential);
        });
    });
    describe('loginWithGoogle', () => {
        it('should sign in with popup', async () => {
            const mockCredential = { user: { uid: '123' } };
            vi.mocked(firebaseAuth.signInWithPopup).mockResolvedValue(mockCredential);
            const result = await authService.loginWithGoogle();
            expect(firebaseAuth.GoogleAuthProvider).toHaveBeenCalled();
            expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
            expect(result).toBe(mockCredential);
        });
    });
    describe('logout', () => {
        it('should sign out', async () => {
            vi.mocked(firebaseAuth.signOut).mockResolvedValue(undefined);
            await authService.logout();
            expect(firebaseAuth.signOut).toHaveBeenCalled();
        });
    });
    describe('mapAuthError', () => {
        it('should map known error codes', () => {
            expect(authService.mapAuthError('auth/email-already-in-use')).toBe('auth.error.emailInUse');
            expect(authService.mapAuthError('auth/invalid-email')).toBe('auth.error.invalidEmail');
            expect(authService.mapAuthError('auth/user-not-found')).toBe('auth.error.userNotFound');
        });
        it('should return code for unknown errors', () => {
            expect(authService.mapAuthError('unknown-error')).toBe('unknown-error');
        });
    });
});
//# sourceMappingURL=authService.spec.js.map