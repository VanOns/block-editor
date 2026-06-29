import { describe, it, expect } from 'vitest'
import defaultSettings from './default-settings'

/**
 * Tests for default settings — Phase 1: Configuration verification
 *
 * Source: Plan Phase 1 "disabledCoreBlocks setting filters blocks correctly"
 */

describe('lib/default-settings', () => {
    describe('disabledCoreBlocks', () => {
        /* Plan: WordPress-specific blocks are disabled by default */
        it('disables WordPress REST-dependent blocks by default', () => {
            const disabled = defaultSettings.disabledCoreBlocks!

            expect(disabled).toContain('core/archives')
            expect(disabled).toContain('core/categories')
            expect(disabled).toContain('core/rss')
            expect(disabled).toContain('core/search')
            expect(disabled).toContain('core/calendar')
            expect(disabled).toContain('core/tag-cloud')
        })

        /* Plan: Non-applicable blocks are disabled */
        it('disables WordPress-only editing blocks', () => {
            const disabled = defaultSettings.disabledCoreBlocks!

            expect(disabled).toContain('core/freeform') // Classic editor
            expect(disabled).toContain('core/shortcode')
            expect(disabled).toContain('core/more')
            expect(disabled).toContain('core/nextpage')
        })

        /* Plan: embed and reusable blocks disabled */
        it('disables embed and reusable block types', () => {
            const disabled = defaultSettings.disabledCoreBlocks!

            expect(disabled).toContain('core/embed')
            expect(disabled).toContain('core/block') // Reusable blocks
        })

        /* Regression: exactly 12 blocks disabled */
        it('has exactly 12 disabled blocks', () => {
            expect(defaultSettings.disabledCoreBlocks).toHaveLength(12)
        })
    })

    describe('editor defaults', () => {
        /* Plan: height has a default */
        it('sets default height to 500px', () => {
            expect(defaultSettings.height).toBe('500px')
        })

        /* Plan: alignWide is enabled */
        it('enables alignWide by default', () => {
            expect(defaultSettings.alignWide).toBe(true)
        })

        /* Plan: supportsLayout is disabled */
        it('disables supportsLayout by default', () => {
            expect(defaultSettings.supportsLayout).toBe(false)
        })

        /* Plan: no media upload by default */
        it('has no mediaUpload handler by default', () => {
            expect(defaultSettings.mediaUpload).toBeUndefined()
        })
    })
})
