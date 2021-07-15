import Block from "../interfaces/block"
import BlockEditorState from "../interfaces/block-editor-state"

const selectors = {
    getBlocks: (state: BlockEditorState): Block[] => state.blocks.current,
    canUndo: (state: BlockEditorState): boolean => state.blocks.past.length > 0,
    canRedo: (state: BlockEditorState): boolean => state.blocks.future.length > 0
}

export default selectors