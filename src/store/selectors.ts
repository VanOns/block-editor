import Block from "../interfaces/block"
import BlockEditorState from "../interfaces/block-editor-state"

const selectors = {
    getBlocks: (state: BlockEditorState[], id: string): Block[] => {
        let _state = state.find(e => e.id == id)
        if (!_state) return []
        return _state.blocks.current
    },
    canUndo: (state: BlockEditorState[], id: string): boolean => {
        let _state = state.find(e => e.id == id)
        if (!_state) return false
        return _state.blocks.past.length > 0
    },
    canRedo: (state: BlockEditorState[], id: string): boolean => {
        let _state = state.find(e => e.id == id)
        if (!_state) return false
        return _state.blocks.future.length > 0
    },
}

export default selectors