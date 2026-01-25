/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authService, userService } from '@subscription-buddy/core'
import { useUserStore } from './userStore'

vi.mock('@subscription-buddy/core', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as any,
    authService: {
      onAuthStateChanged: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      mapAuthError: vi.fn((code: any) => code)
    },
    userService: {
      syncUser: vi.fn(),
      updateProfile: vi.fn()
    }
  }
})

describe('UserStore', () => {
  const TEST_EMAIL = 'test@test.com'
  const TEST_EMAIL = 'test@test.com'
  const TEST_PASSWORD = '123456' // NOSONAR

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
    await store.login(TEST_EMAIL, TEST_PASSWORD)
    expect(authService.login).toHaveBeenCalledWith(TEST_EMAIL, TEST_PASSWORD)
  })

  it('register should call authService and syncUser', async () => {
    const store = useUserStore()
    const mockUser = { uid: '123' }
    vi.mocked(authService.register).mockResolvedValue({ user: mockUser } as any)

    await store.register(TEST_EMAIL, TEST_PASSWORD, 'Test')

    expect(authService.register).toHaveBeenCalled()
    expect(userService.syncUser).toHaveBeenCalledWith(mockUser)
    expect(store.user).toStrictEqual(mockUser)
  })

  it('logout should call authService and clear user', async () => {
    const store = useUserStore()
    store.user = { uid: '123' } as any

    await store.logout()

    expect(authService.logout).toHaveBeenCalled()
    expect(store.user).toBeNull()
  })
})
