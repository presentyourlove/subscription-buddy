/**
 * Chaos Engineering Interceptor
 * Injects artificial latency and errors into network requests.
 * Used for verifying system resilience and error boundaries.
 */

export const initChaos = () => {
    const originalFetch = window.fetch;
    const CHAOS_PROBABILITY = 0.1; // 10% failure rate
    const MIN_LATENCY = 500;
    const MAX_LATENCY = 3000;

    console.warn('⚠️ Chaos Engineering Mode Enabled ⚠️');
    console.warn(`Latency: ${MIN_LATENCY}-${MAX_LATENCY}ms, Failure Rate: ${CHAOS_PROBABILITY * 100}%`);

    window.fetch = async (...args) => {
        // 1. Inject Latency
        const latency = Math.floor(Math.random() * (MAX_LATENCY - MIN_LATENCY + 1)) + MIN_LATENCY;
        await new Promise(resolve => setTimeout(resolve, latency));

        // 2. Inject Failure
        if (Math.random() < CHAOS_PROBABILITY) {
            console.error('💥 Chaos: Injected Network Error');
            throw new TypeError('Failed to fetch (Chaos Injected)');
        }

        return originalFetch(...args);
    };
};
