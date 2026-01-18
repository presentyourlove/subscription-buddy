import { describe, it, expect } from 'vitest'
import { toGroupDTO } from '../../functions/src/utils/mappers'

describe('DTO Mappers', () => {
    describe('toGroupDTO', () => {
        it('should strictly filter out extra fields', () => {
            const rawData = {
                name: 'Netflix Premium',
                price: 390,
                // Sensitive fields
                adminNote: 'Customer is demanding',
                internalFlag: true,
                secretKey: 'sk_live_123',
                // Extra unrelated field
                randomGarbage: 'xyz'
            }
            const id = 'group-123'

            const dto = toGroupDTO(rawData, id)

            // Assertions
            expect(dto.id).toBe(id)
            expect(dto.name).toBe('Netflix Premium')
            expect(dto.price).toBe(390)

            // Critical security checks: these properties SHOULD NOT exist
            // TypeScript won't let us access them, so we cast to any or check keys
            const keys = Object.keys(dto)
            expect(keys).not.toContain('adminNote')
            expect(keys).not.toContain('internalFlag')
            expect(keys).not.toContain('secretKey')
            expect(keys).not.toContain('randomGarbage')
        })

        it('should handle missing optional fields gracefully', () => {
            const rawData = {
                name: 'Spotify'
                // Missing price, members etc.
            }
            const dto = toGroupDTO(rawData, 'id-1')

            expect(dto.name).toBe('Spotify')
            expect(dto.price).toBe(0) // Default default
            expect(dto.currentMembers).toBe(1) // Default default
            expect(dto.tags).toEqual([]) // Default empty array
        })
    })
})
