import Block from "../interfaces/block";

export const SET_BLOCKS = 'SET_BLOCKS'
export const DUPLICATE_BLOCKS = 'DUPLICATE_BLOCKS'
export const REMOVE_BLOCK = 'REMOVE_BLOCK'
export const REMOVE_BLOCKS = 'REMOVE_BLOCKS'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

const actions = {
    setBlocks: (blocks: Block[], id: string) => {
        return {
            type: SET_BLOCKS,
            blocks,
            id
        }
    },
    duplicateBlocks: (blockIds: string[], id: string) => {
        return {
            type: DUPLICATE_BLOCKS,
            blockIds,
            id
        }
    },
    removeBlock: (blockId: string, id: string) => {
        return {
            type: REMOVE_BLOCKS,
            blockIds: [blockId],
            id
        }
    },
    removeBlocks: (blockIds: string[], id: string) => {
        return {
            type: REMOVE_BLOCKS,
            blockIds,
            id
        }
    },
    undo: (id: string) => {
        return { type: UNDO, id }
    },
    redo: (id: string) => {
        return { type: REDO, id }
    }
}

export default actions