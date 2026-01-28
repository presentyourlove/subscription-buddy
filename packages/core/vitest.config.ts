import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            },
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.d.ts', 'src/**/types.ts', 'src/**/index.ts']
        }
    }
});
