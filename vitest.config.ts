import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.ts'],
        setupFiles: ['./src/__tests__/setup.ts'],
        // Full isolation: each test file gets its own forked process
        pool: 'forks',
        fileParallelism: false,
    },
})
