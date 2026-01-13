import { describe, it, expect } from 'vitest';
import { getServiceLogo } from './serviceUtils';
describe('serviceUtils', () => {
    describe('getServiceLogo', () => {
        it('returns Netflix logo for Netflix title', () => {
            expect(getServiceLogo('Netflix Premium')).toMatch(/Netflix/i);
        });
        it('returns Spotify logo for Spotify title', () => {
            expect(getServiceLogo('Spotify Family')).toMatch(/Spotify/i);
        });
        it('returns YouTube logo for YouTube title', () => {
            expect(getServiceLogo('YouTube Premium')).toMatch(/YouTube/i);
        });
        it('returns Disney+ logo for Disney title', () => {
            expect(getServiceLogo('Disney+')).toMatch(/Disney/i);
        });
        it('returns null for unknown service', () => {
            expect(getServiceLogo('Unknown Service')).toBeNull();
        });
    });
});
//# sourceMappingURL=serviceUtils.spec.js.map