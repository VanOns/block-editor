import Block from "../interfaces/block";

export const SET_BLOCKS = 'SET_BLOCKS'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

const actions = {
    setBlocks: (blocks: Block[]) => {
        return {
            type: SET_BLOCKS,
            blocks
        }
    },
    undo: () => {
        return { type: UNDO }
    },
    redo: () => {
        return { type: REDO }
    }
}

export default actions