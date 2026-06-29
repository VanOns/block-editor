import { describe, it, expect } from 'vitest'
import actions, { SET_BLOCKS, DUPLICATE_BLOCKS, REMOVE_BLOCKS, UNDO, REDO } from './actions'
import type Block from '../interfaces/block'

/**
 * Tests for store action creators — Phase 1: Store verification
 *
 * Source: Plan Phase 1 "Store reducer immutability"
 */

const createBlock = (name: string): Block => ({
    clientId: name,
    name,
    attributes: {},
    innerBlocks: [],
    isValid: true,
})

describe('store/actions', () => {
    describe('setBlocks', () => {
        it('creates SET_BLOCKS action with blocks payload', () => {
            const blocks = [createBlock('core/paragraph')]
            const action = actions.setBlocks(blocks)

            expect(action).toEqual({
                type: SET_BLOCKS,
                blocks,
            })
        })

        it('creates action with empty blocks array', () => {
            const action = actions.setBlocks([])

            expect(action).toEqual({
                type: SET_BLOCKS,
                blocks: [],
            })
        })
    })

    describe('duplicateBlocks', () => {
        it('creates DUPLICATE_BLOCKS action with block IDs', () => {
            const action = actions.duplicateBlocks(['id-1', 'id-2'])

            expect(action).toEqual({
                type: DUPLICATE_BLOCKS,
                blockIds: ['id-1', 'id-2'],
            })
        })
    })

    describe('removeBlock', () => {
        it('creates REMOVE_BLOCKS action wrapping single ID in array', () => {
            const action = actions.removeBlock('block-123')

            expect(action).toEqual({
                type: REMOVE_BLOCKS,
                blockIds: ['block-123'],
            })
        })
    })

    describe('removeBlocks', () => {
        it('creates REMOVE_BLOCKS action with multiple IDs', () => {
            const action = actions.removeBlocks(['id-1', 'id-2', 'id-3'])

            expect(action).toEqual({
                type: REMOVE_BLOCKS,
                blockIds: ['id-1', 'id-2', 'id-3'],
            })
        })

        /* Unhappy: empty array */
        it('creates REMOVE_BLOCKS action with empty array', () => {
            const action = actions.removeBlocks([])

            expect(action).toEqual({
                type: REMOVE_BLOCKS,
                blockIds: [],
            })
        })
    })

    describe('undo', () => {
        it('creates UNDO action', () => {
            expect(actions.undo()).toEqual({ type: UNDO })
        })
    })

    describe('redo', () => {
        it('creates REDO action', () => {
            expect(actions.redo()).toEqual({ type: REDO })
        })
    })
})
