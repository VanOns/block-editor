import { v4 as uuid } from 'uuid'
import Block from "../interfaces/block";
import LarabergState from "../interfaces/laraberg-state";
import { DUPLICATE_BLOCKS, REDO, REMOVE_BLOCKS, SET_BLOCKS, UNDO } from "./actions";

const DEFAULT_STATE: LarabergState = {
    blocks: {
        past: [],
        current: [],
        future: []
    }
}

const insertAfter = (current: Block[], add: Block[], blockId: string): Block[] => {
    return current.reduce((arr: Block[], block: Block) => {
        arr.push(block)
        
        if (block.clientId === blockId) {
            arr = arr.concat(add)
        }

        return arr
    }, [])
}

const duplicate = (current: Block[], blockIds: string[]): Block[] => {
    const blocks = current
        .filter((block: Block) => blockIds.includes(block.clientId || ''))
        .map((block: Block) => { 
            return {
                ...block,
                clientId: uuid()
            }
        })

    const lastBlockId = blockIds[blockIds.length - 1]

    return insertAfter(current, blocks, lastBlockId)
}

export default function reducer (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_BLOCKS:
            return {
                ...state,
                blocks: {
                    current: action.blocks,
                    past: [...state.blocks.past, state.blocks.current],
                    future: []
                }
            }
        case DUPLICATE_BLOCKS:
            return {
                ...state,
                blocks: {
                    past: [...state.blocks.past, state.blocks.current],
                    current: duplicate(state.blocks.current, action.blockIds),
                    future: []
                }
            }
        case REMOVE_BLOCKS:
            const removeCurrent = state.blocks.current.filter(block => !action.blockIds.includes(block.clientId))
            return {
                ...state,
                blocks: {
                    past: [...state.blocks.past, state.blocks.current],
                    current: removeCurrent,
                    future: []
                }
            }
        case UNDO:
            if (state.blocks.past.length === 0) return state
            const past = state.blocks.past
            const undoCurrent = past.pop()
            return {
                ...state,
                blocks: {
                    past,
                    current: undoCurrent,
                    future: [state.blocks.current, ...state.blocks.future]
                }
            }
        case REDO:
            if (state.blocks.future.length === 0) return state
            const future = state.blocks.future
            const redoCurrent = future.shift()
            return {
                ...state,
                blocks: {
                    past: [...state.blocks.past, state.blocks.current],
                    current: redoCurrent,
                    future
                }
            }
    }

    return state
}