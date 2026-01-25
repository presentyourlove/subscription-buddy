import { describe, expect, it } from 'vitest'
import { maskData } from '@subscription-buddy/core'

describe('PII Masking Logger', () => {
    describe('Email Masking', () => {
        it('should mask standard email', () => {
            const input = 'testuser@gmail.com'
            const expected = 'tes***@gmail.com'
            expect(maskData(input)).toBe(expected)
        })
        it('should mask short email', () => {
            const input = 'ab@gmail.com'
            expect(maskData(input)).toBe(input)
        })
    })

    describe('Phone Masking', () => {
        it('should mask formatted mobile number', () => {
            const input = '0912-345-678'
            const expected = '0912-***-678'
            expect(maskData(input)).toBe(expected)
        })
        it('should mask unformatted mobile number', () => {
            const input = '0912345678'
            const expected = '0912-***-678'
            expect(maskData(input)).toBe(expected)
        })
        it('should mask space formatted mobile number', () => {
            const input = '0912 345 678'
            const expected = '0912-***-678'
            expect(maskData(input)).toBe(expected)
        })
    })

    describe('Object & Recursive Masking', () => {
        it('should mask sensitive keys in object', () => {
            const input = {
                username: 'john',
                password: 'supersecretpassword',
                token: 'abcdef123456',
                meta: {
                    apiKey: 'AIzaSy...'
                }
            }
            const expected = {
                username: 'john',
                password: '[MASKED]',
                token: '[MASKED]',
                meta: {
                    apiKey: '[MASKED]'
                }
            }
            expect(maskData(input)).toEqual(expected)
        })
        it('should mask sensitive values in nested object even if key is not sensitive (e.g. email in bio)', () => {
            const input = {
                profile: {
                    bio: 'Contact me at myname@company.com for details.',
                    phone: '0988-777-666'
                }
            }
            const expected = {
                profile: {
                    bio: 'Contact me at myn***@company.com for details.',
                    phone: '0988-***-666'
                }
            }
            expect(maskData(input)).toEqual(expected)
        })
        it('should handle arrays', () => {
            const input = ['user@example.com', { password: '123' }]
            const expected = ['use***@example.com', { password: '[MASKED]' }]
            expect(maskData(input)).toEqual(expected)
        })
    })

    describe('Edge Cases', () => {
        it('should handle non-string/object types', () => {
            expect(maskData(123)).toBe(123)
            expect(maskData(null)).toBe(null)
            expect(maskData(undefined)).toBe(undefined)
            expect(maskData(true)).toBe(true)
        })
        it('should ignore Date objects', () => {
            const date = new Date()
            expect(maskData(date)).toBe(date)
        })
    })
})
