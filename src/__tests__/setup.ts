/**
 * Vitest test setup — provides minimal environment for WordPress package mocks
 *
 * The src/env.ts file sets window.process which conflicts with Vitest's own
 * process reference. We ensure process exists before any module imports.
 */

// Ensure process is available in jsdom environment (Vitest needs it)
if (typeof globalThis.process === 'undefined') {
    (globalThis as any).process = { env: {} }
}

beforeEach(() => {
    // Reset globalThis properties that env.ts should set
    delete (globalThis as any).IS_GUTENBERG_PLUGIN
    delete (globalThis as any).IS_WORDPRESS_CORE
    delete (globalThis as any).SCRIPT_DEBUG
})
