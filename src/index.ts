import './styles.scss'
import './env'

export * as wordpress from './wordpress'
export { registerBlockType } from '@wordpress/blocks'
export { initializeEditor, Editor } from './components/Editor'
