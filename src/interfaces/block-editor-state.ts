import Block from "./block";

export interface BlocksState {
    past: Block[][],
    current: Block[],
    future: Block[][]
}

export default interface BlockEditorState {
    blocks: BlocksState
}