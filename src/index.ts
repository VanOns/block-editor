import './styles.scss'
import './env'

import { registerBlockType } from "@wordpress/blocks";

import { initializeEditor, Editor } from './components/editor'

export {
    initializeEditor,
    Editor,
    registerBlockType
}
