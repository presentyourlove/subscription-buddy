import { describe, expect, it } from 'vitest'
import { toGroupDTO } from '@subscription-buddy/core'

describe('DTO Mappers', () => {
    describe('toGroupDTO', () => {
        it('should strictly filter out extra fields', () => {
            const rawData = {
                title: 'Netflix Premium',
                price: 390,
                serviceName: 'Netflix',
                hostId: 'host-123',
                hostName: 'Host User',
                // Sensitive fields
                adminNote: 'Customer is demanding',
                internalFlag: true,
                secretKey: 'sk_live_123',
                // Extra unrelated field
                randomGarbage: 'xyz'
            }
            const id = 'group-123'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dto: any = toGroupDTO(rawData, id)

            // Assertions
            expect(dto.id).toBe(id)
            expect(dto.title).toBe('Netflix Premium')
            expect(dto.price).toBe(390)

            // Critical security checks: these properties SHOULD NOT exist
            const keys = Object.keys(dto)
            expect(keys).not.toContain('adminNote')
            expect(keys).not.toContain('internalFlag')
            expect(keys).not.toContain('secretKey')
            expect(keys).not.toContain('randomGarbage')
        })

        it('should handle missing optional fields gracefully', () => {
            const rawData = {
                title: 'Spotify'
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dto = toGroupDTO(rawData as any, 'id-1')
            expect(dto.title).toBe('Spotify')
            expect(dto.price).toBe(0)
            expect(dto.slots).toBe(10) // Default to MAX_SLOTS
            expect(dto.hostId).toBe('')
        })
    })
})

