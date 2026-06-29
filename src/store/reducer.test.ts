import { describe, it, expect } from 'vitest'
import reducer from './reducer'
import { SET_BLOCKS, UNDO, REDO } from './actions'
import type BlockEditorState from '../interfaces/block-editor-state'
import type Block from '../interfaces/block'

/**
 * Tests for the store reducer — Phase 1: Immutability Fix
 *
 * These tests verify that the reducer uses immutable operations
 * (slice instead of pop/shift) and that undo/redo work correctly.
 */

const createBlock = (name: string, clientId: string = name): Block => ({
    clientId,
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

describe('store/reducer', () => {
    describe('SET_BLOCKS', () => {
        /* Plan Phase 1: Store reducer immutability */
        it('sets blocks as the new current state', () => {
            const initial = createState()
            const blocks = [createBlock('core/paragraph')]

            const result = reducer(initial, { type: SET_BLOCKS, blocks })

            expect(result.blocks.current).toEqual(blocks)
        })

        /* Plan Phase 1: Immutability requirement */
        it('does not mutate the previous state object', () => {
            const initial = createState([createBlock('core/paragraph')])
            const originalPast = [...initial.blocks.past]
            const originalCurrent = [...initial.blocks.current]

            const blocks = [createBlock('core/heading')]
            reducer(initial, { type: SET_BLOCKS, blocks })

            // Original state must be unchanged
            expect(initial.blocks.past).toEqual(originalPast)
            expect(initial.blocks.current).toEqual(originalCurrent)
        })

        /* Plan Phase 1: Immutability — past array must not be mutated */
        it('pushes current to past without mutating the past array', () => {
            const existingPast = [[createBlock('core/image')]]
            const current = [createBlock('core/paragraph')]
            const initial = createState(current, existingPast)

            const pastRefBefore = initial.blocks.past
            const blocks = [createBlock('core/heading')]
            reducer(initial, { type: SET_BLOCKS, blocks })

            // The original past array reference must not have been mutated
            expect(pastRefBefore).toHaveLength(1)
            expect(pastRefBefore[0]).toEqual([createBlock('core/image')])
        })

        /* Plan Phase 1: History limit of 20 */
        it('limits past history to 20 entries', () => {
            const past = Array.from({ length: 20 }, (_, i) => [createBlock(`core/block-${i}`)])
            const current = [createBlock('core/current')]
            const initial = createState(current, past)

            const blocks = [createBlock('core/new')]
            const result = reducer(initial, { type: SET_BLOCKS, blocks })

            expect(result.blocks.past).toHaveLength(20)
        })

        /* Plan Phase 1: SET_BLOCKS clears future */
        it('clears future when new blocks are set', () => {
            const future = [[createBlock('core/future')]]
            const initial = createState([createBlock('core/current')], [], future)

            const blocks = [createBlock('core/new')]
            const result = reducer(initial, { type: SET_BLOCKS, blocks })

            expect(result.blocks.future).toHaveLength(0)
        })

        /* Unhappy: empty blocks array */
        it('handles empty blocks array', () => {
            const initial = createState([createBlock('core/paragraph')])
            const result = reducer(initial, { type: SET_BLOCKS, blocks: [] })

            expect(result.blocks.current).toEqual([])
            expect(result.blocks.past).toHaveLength(1)
        })
    })

    describe('UNDO', () => {
        /* Plan Phase 1: Immutable undo */
        it('restores the most recent past state as current', () => {
            const previousBlocks = [createBlock('core/paragraph')]
            const currentBlocks = [createBlock('core/heading')]
            const initial = createState(currentBlocks, [previousBlocks])

            const result = reducer(initial, { type: UNDO })

            expect(result.blocks.current).toEqual(previousBlocks)
        })

        /* Plan Phase 1: Immutability — UNDO must not mutate past array */
        it('does not mutate the original past array (no .pop())', () => {
            const pastEntry = [createBlock('core/paragraph')]
            const past = [pastEntry]
            const initial = createState([createBlock('core/heading')], past)

            const pastRefBefore = initial.blocks.past
            const pastLengthBefore = initial.blocks.past.length

            reducer(initial, { type: UNDO })

            // The original past array must NOT have been mutated by .pop()
            expect(initial.blocks.past.length).toBe(pastLengthBefore)
            expect(pastRefBefore.length).toBe(pastLengthBefore)
        })

        /* Plan Phase 1: UNDO moves current to future */
        it('moves current state to future', () => {
            const currentBlocks = [createBlock('core/heading')]
            const initial = createState(currentBlocks, [[createBlock('core/paragraph')]])

            const result = reducer(initial, { type: UNDO })

            expect(result.blocks.future[0]).toEqual(currentBlocks)
        })

        /* Plan Phase 1: Multi-step undo */
        it('supports multiple undo operations in sequence', () => {
            const block1 = [createBlock('core/block-1')]
            const block2 = [createBlock('core/block-2')]
            const block3 = [createBlock('core/block-3')]
            const initial = createState(block3, [block1, block2])

            const afterFirst = reducer(initial, { type: UNDO })
            expect(afterFirst.blocks.current).toEqual(block2)

            const afterSecond = reducer(afterFirst, { type: UNDO })
            expect(afterSecond.blocks.current).toEqual(block1)
        })

        /* Unhappy: UNDO with empty past */
        it('returns unchanged state when past is empty', () => {
            const initial = createState([createBlock('core/paragraph')], [])

            const result = reducer(initial, { type: UNDO })

            expect(result).toBe(initial) // Same reference — no operation
        })

        /* Unhappy: UNDO preserves existing future entries */
        it('prepends current to existing future entries', () => {
            const futureEntry = [createBlock('core/future')]
            const currentBlocks = [createBlock('core/current')]
            const pastEntry = [createBlock('core/past')]
            const initial = createState(currentBlocks, [pastEntry], [futureEntry])

            const result = reducer(initial, { type: UNDO })

            expect(result.blocks.future).toHaveLength(2)
            expect(result.blocks.future[0]).toEqual(currentBlocks)
            expect(result.blocks.future[1]).toEqual(futureEntry)
        })
    })

    describe('REDO', () => {
        /* Plan Phase 1: Immutable redo */
        it('restores the first future state as current', () => {
            const futureBlocks = [createBlock('core/heading')]
            const initial = createState([createBlock('core/paragraph')], [], [futureBlocks])

            const result = reducer(initial, { type: REDO })

            expect(result.blocks.current).toEqual(futureBlocks)
        })

        /* Plan Phase 1: Immutability — REDO must not mutate future array */
        it('does not mutate the original future array (no .shift())', () => {
            const futureEntry = [createBlock('core/heading')]
            const future = [futureEntry]
            const initial = createState([createBlock('core/paragraph')], [], future)

            const futureLengthBefore = initial.blocks.future.length

            reducer(initial, { type: REDO })

            // The original future array must NOT have been mutated by .shift()
            expect(initial.blocks.future.length).toBe(futureLengthBefore)
        })

        /* Plan Phase 1: REDO moves current to past */
        it('moves current state to past', () => {
            const currentBlocks = [createBlock('core/paragraph')]
            const initial = createState(currentBlocks, [], [[createBlock('core/heading')]])

            const result = reducer(initial, { type: REDO })

            expect(result.blocks.past[result.blocks.past.length - 1]).toEqual(currentBlocks)
        })

        /* Plan Phase 1: Multi-step redo */
        it('supports multiple redo operations in sequence', () => {
            const block1 = [createBlock('core/block-1')]
            const block2 = [createBlock('core/block-2')]
            const block3 = [createBlock('core/block-3')]
            const initial = createState(block1, [], [block2, block3])

            const afterFirst = reducer(initial, { type: REDO })
            expect(afterFirst.blocks.current).toEqual(block2)

            const afterSecond = reducer(afterFirst, { type: REDO })
            expect(afterSecond.blocks.current).toEqual(block3)
        })

        /* Unhappy: REDO with empty future */
        it('returns unchanged state when future is empty', () => {
            const initial = createState([createBlock('core/paragraph')], [], [])

            const result = reducer(initial, { type: REDO })

            expect(result).toBe(initial) // Same reference — no operation
        })
    })

    describe('UNDO + REDO round-trip', () => {
        /* Plan Phase 1: Full undo/redo cycle */
        it('restores exact state after undo then redo', () => {
            const block1 = [createBlock('core/block-1')]
            const block2 = [createBlock('core/block-2')]
            const initial = createState(block2, [block1])

            const afterUndo = reducer(initial, { type: UNDO })
            const afterRedo = reducer(afterUndo, { type: REDO })

            expect(afterRedo.blocks.current).toEqual(block2)
            expect(afterRedo.blocks.past).toEqual([block1])
            expect(afterRedo.blocks.future).toHaveLength(0)
        })
    })

    describe('unknown action', () => {
        /* Unhappy: unrecognized action type */
        it('returns unchanged state for unknown action types', () => {
            const initial = createState([createBlock('core/paragraph')])
            const result = reducer(initial, { type: 'UNKNOWN_ACTION' })

            expect(result).toBe(initial)
        })
    })
})
