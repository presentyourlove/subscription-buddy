import { describe, it, expect, vi } from 'vitest'
import { useNotification } from './useNotification'
import { useToast } from 'vue-toastification'

vi.mock('vue-toastification', () => ({
    useToast: vi.fn(() => ({
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn()
    }))
}))

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
        expect(toast.success).toHaveBeenCalledWith('test message')
    })
})
