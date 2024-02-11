import BlockEditorState from "../interfaces/block-editor-state";
import {REDO, SET_BLOCKS, UNDO} from "./actions";
import {produce} from 'immer'

const DEFAULT_STATE: BlockEditorState[] = [{
    blocks: {
        past: [],
        current: [],
        future: []
    },
    id: ''
}]

export default function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_BLOCKS:
            return produce(state, draft => {
                const isExists = draft.find(d => d.id == action.id)
                if (!isExists) draft.push({
                    blocks: {
                        past: [],
                        current: [],
                        future: []
                    },
                    id: action.id
                })

                const _draft = draft.find(d => d.id == action.id)
                if (_draft) {
                    _draft.blocks = {
                        current: action.blocks,
                        past: [
                            ..._draft.blocks.past.slice(-19),
                            _draft.blocks.current
                        ],
                        future: []
                    }
                }
            })
        case UNDO:
            return produce(state, draft => {
                const _draft = draft.find(d => d.id == action.id)
                if (!_draft || _draft.blocks.past.length == 0) return

                const past = _draft.blocks.past
                const undoCurrent = past.pop() || []

                _draft.blocks = {
                    past,
                    current: undoCurrent,
                    future: [_draft.blocks.current, ..._draft.blocks.future]
                }
            })
        case REDO:
            return produce(state, draft => {
                const _draft = draft.find(d => d.id == action.id)
                if (!_draft || _draft.blocks.future.length == 0) return

                const future = _draft.blocks.future
                const redoCurrent = future.shift() || []

                _draft.blocks = {
                    past: [..._draft.blocks.past, _draft.blocks.current],
                    current: redoCurrent,
                    future
                }
            })
        default:
            break;
    }

    return state
}
