import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './userStore';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
vi.mock('../services/authService', () => ({
    authService: {
        onAuthStateChanged: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loginWithGoogle: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        mapAuthError: vi.fn((code) => code)
    }
}));
vi.mock('../services/userService', () => ({
    userService: {
        syncUser: vi.fn(),
        updateProfile: vi.fn()
    }
}));
describe('UserStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });
    it('initAuth should set up listener', () => {
        const store = useUserStore();
        store.initAuth();
        expect(authService.onAuthStateChanged).toHaveBeenCalled();
    });
    it('login should call authService', async () => {
        const store = useUserStore();
        await store.login('test@test.com', '123456');
        expect(authService.login).toHaveBeenCalledWith('test@test.com', '123456');
    });
    it('register should call authService and syncUser', async () => {
        const store = useUserStore();
        const mockUser = { uid: '123' };
        vi.mocked(authService.register).mockResolvedValue({ user: mockUser });
        await store.register('test@test.com', '123456', 'Test');
        expect(authService.register).toHaveBeenCalled();
        expect(userService.syncUser).toHaveBeenCalledWith(mockUser);
        expect(store.user).toBe(mockUser);
    });
    it('logout should call authService and clear user', async () => {
        const store = useUserStore();
        store.user = { uid: '123' };
        await store.logout();
        expect(authService.logout).toHaveBeenCalled();
        expect(store.user).toBeNull();
    });
});
//# sourceMappingURL=userStore.spec.js.map