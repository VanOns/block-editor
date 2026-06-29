import { describe, it, expect } from 'vitest'
import selectors from './selectors'
import type BlockEditorState from '../interfaces/block-editor-state'
import type Block from '../interfaces/block'

/**
 * Tests for store selectors — Phase 1: Runtime Verification
 *
 * Source: Plan Testing Strategy "Undo/Redo: 3+ operations, then undo all, redo all"
 */

const createBlock = (name: string): Block => ({
    clientId: name,
    name,
    attributes: {},
    innerBlocks: [],
    isValid: true,
})

const createState = (
    current: Block[] = [],
    past: Block[][] = [],
    future: Block[][] = []
): BlockEditorState => ({
    blocks: { past, current, future },
})

describe('store/selectors', () => {
    describe('getBlocks', () => {
        /* Plan Phase 1: Selectors return current blocks */
        it('returns the current blocks array', () => {
            const blocks = [createBlock('core/paragraph'), createBlock('core/heading')]
            const state = createState(blocks)

            expect(selectors.getBlocks(state)).toBe(blocks)
        })

        /* Unhappy: empty current */
        it('returns empty array when no blocks exist', () => {
            const state = createState([])

            expect(selectors.getBlocks(state)).toEqual([])
        })
    })

    describe('canUndo', () => {
        /* Plan Phase 1: canUndo is true when past has entries */
        it('returns true when past has entries', () => {
            const state = createState([], [[createBlock('core/paragraph')]])

            expect(selectors.canUndo(state)).toBe(true)
        })

        /* Plan Phase 1: canUndo is false when past is empty */
        it('returns false when past is empty', () => {
            const state = createState([], [])

            expect(selectors.canUndo(state)).toBe(false)
        })

        /* Boundary: multiple past entries */
        it('returns true with multiple past entries', () => {
            const state = createState(
                [],
                [[createBlock('a')], [createBlock('b')], [createBlock('c')]]
            )

            expect(selectors.canUndo(state)).toBe(true)
        })
    })

    describe('canRedo', () => {
        /* Plan Phase 1: canRedo is true when future has entries */
        it('returns true when future has entries', () => {
            const state = createState([], [], [[createBlock('core/paragraph')]])

            expect(selectors.canRedo(state)).toBe(true)
        })

        /* Plan Phase 1: canRedo is false when future is empty */
        it('returns false when future is empty', () => {
            const state = createState([], [], [])

            expect(selectors.canRedo(state)).toBe(false)
        })

        /* Boundary: multiple future entries */
        it('returns true with multiple future entries', () => {
            const state = createState(
                [],
                [],
                [[createBlock('a')], [createBlock('b')]]
            )

            expect(selectors.canRedo(state)).toBe(true)
        })
    })
})
