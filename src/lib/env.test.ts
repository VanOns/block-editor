import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Tests for environment shim — Phase 2: globalThis Migration
 *
 * These tests verify that:
 * 1. globalThis.IS_GUTENBERG_PLUGIN is set correctly (Gutenberg v13+ requirement)
 * 2. globalThis.IS_WORDPRESS_CORE is set correctly
 * 3. Legacy window.process.env shim is preserved for transitive deps
 * 4. window.wp namespace is initialized
 * 5. Existing window.process values are not overwritten
 *
 * Source: Plan Phase 2, Threat Model MEDIUM risk "window.process shim overwritten"
 *
 * NOTE: The current env.ts directly assigns window.process = { env: {...} }
 * which is destructive. The new implementation must use conditional merging.
 * Tests asserting the NEW (non-destructive) behavior will fail against the
 * current implementation — this is the intended RED state.
 */

describe('env', () => {
    beforeEach(() => {
        vi.resetModules()
        // Reset globalThis properties
        delete (globalThis as any).IS_GUTENBERG_PLUGIN
        delete (globalThis as any).IS_WORDPRESS_CORE
        delete (globalThis as any).SCRIPT_DEBUG
    })

    describe('globalThis flags (Gutenberg v13+ pattern)', () => {
        /* Plan Phase 2: globalThis.IS_GUTENBERG_PLUGIN set */
        it('sets globalThis.IS_GUTENBERG_PLUGIN to false', async () => {
            await import('../env')

            expect((globalThis as any).IS_GUTENBERG_PLUGIN).toBe(false)
        })

        /* Plan Phase 2: globalThis.IS_WORDPRESS_CORE set */
        it('sets globalThis.IS_WORDPRESS_CORE to false', async () => {
            await import('../env')

            expect((globalThis as any).IS_WORDPRESS_CORE).toBe(false)
        })

        /* Plan Phase 2: globalThis.SCRIPT_DEBUG set */
        it('sets globalThis.SCRIPT_DEBUG to false', async () => {
            await import('../env')

            expect((globalThis as any).SCRIPT_DEBUG).toBe(false)
        })
    })

    describe('legacy window.process.env shim', () => {
        /* Plan Phase 2: window.process.env still set for legacy compat */
        it('sets window.process.env.FORCE_REDUCED_MOTION', async () => {
            await import('../env')

            // In jsdom/Node, process.env coerces to string "false"
            // In real browsers, window.process.env is a plain object so it stays boolean
            // Either way, the property must exist and represent a false-like value
            const value = (window as any).process.env.FORCE_REDUCED_MOTION
            expect(value === false || value === 'false').toBe(true)
        })

        /* Threat Model MEDIUM: protect existing window.process values */
        it('does not overwrite existing window.process properties', async () => {
            // Pre-set a property that should survive the import
            const originalProcess = (window as any).process || {}
            ;(window as any).process = { ...originalProcess, customProp: 'preserved' }

            await import('../env')

            // The new implementation must use: process = process || {}
            // not: process = { env: {...} } which destroys customProp
            expect((window as any).process.customProp).toBe('preserved')
        })

        /* Threat Model MEDIUM: no overwrite of pre-existing process.env entries */
        it('preserves existing process.env entries when merging', async () => {
            ;(window as any).process = {
                env: { NODE_ENV: 'production', CUSTOM_FLAG: true },
            }

            await import('../env')

            expect((window as any).process.env.NODE_ENV).toBe('production')
            expect((window as any).process.env.CUSTOM_FLAG).toBe(true)
            expect((window as any).process.env.FORCE_REDUCED_MOTION).toBe(false)
        })
    })

    describe('window.wp namespace', () => {
        /* Plan Phase 2: window.wp initialized */
        it('initializes window.wp as an object', async () => {
            delete (window as any).wp

            await import('../env')

            expect((window as any).wp).toBeDefined()
            expect(typeof (window as any).wp).toBe('object')
        })

        /* Threat Model: existing wp not overwritten */
        it('does not overwrite existing window.wp object', async () => {
            ;(window as any).wp = { existingPlugin: true }

            await import('../env')

            expect((window as any).wp.existingPlugin).toBe(true)
        })
    })
})
