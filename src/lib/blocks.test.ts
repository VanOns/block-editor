import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Tests for block registration — Phase 2: Experimental API Fallback
 *
 * These tests verify that:
 * 1. When __experimentalGetCoreBlocks is available, blocks are filtered and registered
 * 2. When __experimentalGetCoreBlocks is unavailable, fallback to registerCoreBlocks() occurs
 * 3. The disabledCoreBlocks setting correctly filters blocks
 * 4. Already-registered blocks are not re-registered
 *
 * Source: Plan Phase 2, Threat Model HIGH risk "__experimentalGetCoreBlocks removal"
 */

const mockCoreBlocks = [
    { name: 'core/paragraph', init: vi.fn(), metadata: {}, settings: {} },
    { name: 'core/heading', init: vi.fn(), metadata: {}, settings: {} },
    { name: 'core/image', init: vi.fn(), metadata: {}, settings: {} },
    { name: 'core/embed', init: vi.fn(), metadata: {}, settings: {} },
    { name: 'core/freeform', init: vi.fn(), metadata: {}, settings: {} },
]

// Mock @wordpress/blocks
vi.mock('@wordpress/blocks', () => ({
    getBlockTypes: vi.fn(() => []),
}))

// Mock @wordpress/block-library
vi.mock('@wordpress/block-library', () => ({
    __experimentalGetCoreBlocks: vi.fn(() => mockCoreBlocks),
    registerCoreBlocks: vi.fn(),
}))

describe('lib/blocks', () => {
    let mockGetBlockTypes: any
    let mockRegisterCoreBlocks: any

    beforeEach(async () => {
        vi.resetModules()

        // Re-setup mocks after reset
        vi.doMock('@wordpress/blocks', () => ({
            getBlockTypes: vi.fn(() => []),
        }))
        vi.doMock('@wordpress/block-library', () => ({
            __experimentalGetCoreBlocks: vi.fn(() => [...mockCoreBlocks]),
            registerCoreBlocks: vi.fn(),
        }))
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('registerBlocks', () => {
        /* Plan Phase 2: Normal operation — experimental API available */
        it('registers filtered core blocks when experimental API is available', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')

            registerBlocks([])

            expect((blockLibrary as any).registerCoreBlocks).toHaveBeenCalled()
        })

        /* Plan Phase 2: Disabled blocks filtering */
        it('filters out disabled core blocks from registration', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')
            const disabled = ['core/embed', 'core/freeform']

            registerBlocks(disabled)

            const registeredBlocks = (blockLibrary as any).registerCoreBlocks.mock.calls[0][0]
            const registeredNames = registeredBlocks.map((b: any) => b.name)
            expect(registeredNames).not.toContain('core/embed')
            expect(registeredNames).not.toContain('core/freeform')
            expect(registeredNames).toContain('core/paragraph')
            expect(registeredNames).toContain('core/heading')
            expect(registeredNames).toContain('core/image')
        })

        /* Plan Phase 2: Already-registered blocks are skipped */
        it('does not re-register blocks that are already registered', async () => {
            vi.doMock('@wordpress/blocks', () => ({
                getBlockTypes: vi.fn(() => [{ name: 'core/paragraph' }]),
            }))
            vi.doMock('@wordpress/block-library', () => ({
                __experimentalGetCoreBlocks: vi.fn(() => [...mockCoreBlocks]),
                registerCoreBlocks: vi.fn(),
            }))
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')

            registerBlocks([])

            const registeredBlocks = (blockLibrary as any).registerCoreBlocks.mock.calls[0][0]
            const registeredNames = registeredBlocks.map((b: any) => b.name)
            expect(registeredNames).not.toContain('core/paragraph')
        })

        /* Threat Model HIGH: __experimentalGetCoreBlocks unavailable — fallback */
        it('falls back to registerCoreBlocks() without filtering when experimental API is unavailable', async () => {
            vi.doMock('@wordpress/block-library', () => ({
                __experimentalGetCoreBlocks: undefined,
                registerCoreBlocks: vi.fn(),
            }))
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

            registerBlocks(['core/embed'])

            // Should call registerCoreBlocks without arguments (register all)
            expect((blockLibrary as any).registerCoreBlocks).toHaveBeenCalledWith()
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('__experimentalGetCoreBlocks is unavailable')
            )

            consoleSpy.mockRestore()
        })

        /* Threat Model HIGH: Experimental API throws */
        it('falls back gracefully when experimental API throws', async () => {
            vi.doMock('@wordpress/block-library', () => ({
                get __experimentalGetCoreBlocks() {
                    throw new Error('module removed')
                },
                registerCoreBlocks: vi.fn(),
            }))
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

            registerBlocks(['core/embed'])

            expect((blockLibrary as any).registerCoreBlocks).toHaveBeenCalledWith()
            consoleSpy.mockRestore()
        })

        /* Unhappy: empty disabledCoreBlocks array */
        it('registers all core blocks when disabledCoreBlocks is empty', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')

            registerBlocks([])

            const registeredBlocks = (blockLibrary as any).registerCoreBlocks.mock.calls[0][0]
            expect(registeredBlocks).toHaveLength(mockCoreBlocks.length)
        })

        /* Unhappy: disabledCoreBlocks contains non-existent block names */
        it('ignores disabled block names that do not exist in core blocks', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')

            registerBlocks(['core/nonexistent', 'core/also-fake'])

            const registeredBlocks = (blockLibrary as any).registerCoreBlocks.mock.calls[0][0]
            expect(registeredBlocks).toHaveLength(mockCoreBlocks.length)
        })

        /* Unhappy: all blocks are disabled */
        it('registers nothing when all blocks are disabled', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')
            const allNames = mockCoreBlocks.map(b => b.name)

            registerBlocks(allNames)

            const registeredBlocks = (blockLibrary as any).registerCoreBlocks.mock.calls[0][0]
            expect(registeredBlocks).toHaveLength(0)
        })

        /* Unhappy: default parameter — undefined disabledCoreBlocks */
        it('defaults to empty array when disabledCoreBlocks is undefined', async () => {
            const blockLibrary = await import('@wordpress/block-library')
            const { registerBlocks } = await import('./blocks')

            registerBlocks()

            expect((blockLibrary as any).registerCoreBlocks).toHaveBeenCalled()
        })
    })

    describe('getCoreBlocks', () => {
        /* Plan Phase 2: getCoreBlocks filters by disabled list */
        it('returns blocks not in the disabled list', async () => {
            const { getCoreBlocks } = await import('./blocks')

            const result = getCoreBlocks(mockCoreBlocks, ['core/embed'])

            expect(result).toHaveLength(4)
            expect(result.map(b => b.name)).not.toContain('core/embed')
        })

        /* Unhappy: empty allBlocks */
        it('returns empty array when allBlocks is empty', async () => {
            const { getCoreBlocks } = await import('./blocks')

            const result = getCoreBlocks([], ['core/embed'])

            expect(result).toEqual([])
        })
    })
})
