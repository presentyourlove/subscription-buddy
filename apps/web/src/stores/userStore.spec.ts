/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { useUserStore } from './userStore'

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
}))

vi.mock('../services/userService', () => ({
  userService: {
    syncUser: vi.fn(),
    updateProfile: vi.fn()
  }
}))

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initAuth should set up listener', () => {
    const store = useUserStore()
    store.initAuth()
    expect(authService.onAuthStateChanged).toHaveBeenCalled()
  })

  it('login should call authService', async () => {
    const store = useUserStore()
    await store.login('test@test.com', '123456')
    expect(authService.login).toHaveBeenCalledWith('test@test.com', '123456')
  })

  it('register should call authService and syncUser', async () => {
    const store = useUserStore()
    const mockUser = { uid: '123' }
    vi.mocked(authService.register).mockResolvedValue({ user: mockUser } as any)

    await store.register('test@test.com', '123456', 'Test')

    expect(authService.register).toHaveBeenCalled()
    expect(userService.syncUser).toHaveBeenCalledWith(mockUser)
    expect(store.user).toBe(mockUser)
  })

  it('logout should call authService and clear user', async () => {
    const store = useUserStore()
    store.user = { uid: '123' } as any

    await store.logout()

    expect(authService.logout).toHaveBeenCalled()
    expect(store.user).toBeNull()
  })
})
