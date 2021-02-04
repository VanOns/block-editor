import Block from "../interfaces/block"
import LarabergState from "../interfaces/laraberg-state"

const selectors = {
    getBlocks: (state: LarabergState): Block[] => state.blocks.current,
    canUndo: (state: LarabergState): boolean => state.blocks.past.length > 0,
    canRedo: (state: LarabergState): boolean => state.blocks.future.length > 0
}

export default selectors