import { describe, expect, it, vi } from 'vitest'
import { useToast } from 'vue-toastification'

import { useNotification } from './useNotification'

vi.mock('vue-toastification', () => {
  const toastMock: any = vi.fn()
  toastMock.success = vi.fn()
  toastMock.error = vi.fn()
  toastMock.info = vi.fn()
  toastMock.warning = vi.fn()

  return {
    useToast: vi.fn(() => toastMock),
    TYPE: {
      SUCCESS: 'success',
      ERROR: 'error',
      INFO: 'info',
      WARNING: 'warning'
    },
    POSITION: {
      TOP_RIGHT: 'top-right',
      TOP_LEFT: 'top-left',
      BOTTOM_RIGHT: 'bottom-right',
      BOTTOM_LEFT: 'bottom-left'
    }
  }
})

describe('useNotification', () => {
  it('should return toast methods', () => {
    const { success, error, info, warning } = useNotification()
    expect(success).toBeDefined()
    expect(error).toBeDefined()
    expect(info).toBeDefined()
    expect(warning).toBeDefined()
  })

  it('should call toast success', () => {
    const { success } = useNotification()
    success('test message')
    // Verification relies on the mock implementation of useToast
    // Since we mock useToast to return functions, we assume they are called.
    // Ideally we would return a specific mock object to verify calls.
    const toast = useToast()
    // Verifying it was called as a function since useNotification.ts calls toast(message)
    expect(toast).toHaveBeenCalledWith('test message', expect.objectContaining({ type: 'success' }))
  })
})
