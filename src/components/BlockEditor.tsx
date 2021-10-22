import { createElement } from '@wordpress/element'
import {
    BlockEditorProvider,
    BlockInspector,
    BlockList,
    BlockTools,
    Inserter,
    ObserveTyping,
    WritingFlow
} from '@wordpress/block-editor'
import { serialize } from '@wordpress/blocks'
import { ToolbarButton, Popover } from '@wordpress/components'
import { undo as undoIcon, redo as redoIcon } from '@wordpress/icons'

import Header from './header'
import Sidebar from './sidebar'
import InserterToggle from './InserterToggle'
import EditorSettings from '../interfaces/editor-settings'
import Block from '../interfaces/block'
import KeyboardShortcuts from "./KeyboardShortcuts"
import Notices from "./Notices"
import '@wordpress/format-library'


interface BlockEditorProps {
    settings: EditorSettings,
    blocks: Block[],
    onChange: (value: string) => void,
    updateBlocks: (blocks: Block[]) => void,
    undo?: () => void,
    redo?: () => void,
    canUndo?: boolean,
    canRedo?: boolean
}

const BlockEditor = ({ settings, onChange, blocks, updateBlocks, undo, redo, canUndo, canRedo }: BlockEditorProps) => {
    const handleInput = (blocks: Block[]) => {
        updateBlocks(blocks)
        onChange(serialize(blocks))
    }

    const handleChange = (blocks: Block[]) => {
        updateBlocks(blocks)
        onChange(serialize(blocks))
    }

    return (
        <div className="block-editor__editor">
            <BlockEditorProvider
                value={blocks}
                onInput={handleInput}
                onChange={handleChange}
                settings={settings}
            >
                <Notices/>
                <Header.HeaderFill>
                    <Inserter renderToggle={InserterToggle} />
                    <ToolbarButton icon={undoIcon} onClick={undo} disabled={!canUndo} className={'history-button'} />
                    <ToolbarButton icon={redoIcon} onClick={redo} disabled={!canRedo} className={'history-button'} />
                </Header.HeaderFill>
                <Sidebar.InspectorFill>
                    <BlockInspector />
                </Sidebar.InspectorFill>
                <BlockTools>
                    <KeyboardShortcuts/>
                    <WritingFlow className="editor-styles-wrapper">
                        <ObserveTyping>
                            <BlockList />
                        </ObserveTyping>
                    </WritingFlow>
                </BlockTools>
                <Popover.Slot/>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
