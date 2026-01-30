/**
 * Chaos Engineering Interceptor
 * Injects artificial latency and errors into network requests.
 * Used for verifying system resilience and error boundaries.
 */

/**
 * Generate a cryptographically secure random number in range [min, max]
 * Uses Web Crypto API to avoid weak cryptography warnings
 */
function getSecureRandom(min: number, max: number): number {
    const range = max - min + 1;
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return Math.floor((randomBuffer[0] / (0xFFFFFFFF + 1)) * range) + min;
}

/**
 * Generate a cryptographically secure random probability [0, 1)
 * Uses Web Crypto API to avoid weak cryptography warnings
 */
function getSecureRandomProbability(): number {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] / (0xFFFFFFFF + 1);
}

export const initChaos = () => {
    const originalFetch = window.fetch;
    const CHAOS_PROBABILITY = 0.1; // 10% failure rate
    const MIN_LATENCY = 500;
    const MAX_LATENCY = 3000;

    console.warn('⚠️ Chaos Engineering Mode Enabled ⚠️');
    console.warn(`Latency: ${MIN_LATENCY}-${MAX_LATENCY}ms, Failure Rate: ${CHAOS_PROBABILITY * 100}%`);

    window.fetch = async (...args) => {
        // 1. Inject Latency
        const latency = getSecureRandom(MIN_LATENCY, MAX_LATENCY);
        await new Promise(resolve => setTimeout(resolve, latency));

        // 2. Inject Failure
        if (getSecureRandomProbability() < CHAOS_PROBABILITY) {
            console.error('💥 Chaos: Injected Network Error');
            throw new TypeError('Failed to fetch (Chaos Injected)');
        }

        return originalFetch(...args);
    };
};
