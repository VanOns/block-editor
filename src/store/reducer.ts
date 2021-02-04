import LarabergState from "../interfaces/laraberg-state";
import { REDO, SET_BLOCKS, UNDO } from "./actions";

const DEFAULT_STATE: LarabergState = {
    blocks: {
        past: [],
        current: [],
        future: []
    }
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