import { createElement } from '@wordpress/element'
import {
    BlockEditorKeyboardShortcuts,
    BlockEditorProvider,
    BlockInspector,
    BlockList,
    Inserter,
    ObserveTyping,
    WritingFlow
} from '@wordpress/block-editor'
import { serialize } from '@wordpress/blocks'
import { Popover } from '@wordpress/components'

import Header from './header'
import Sidebar from './sidebar'
import InserterToggle from './inserter-toggle'

const BlockEditor = ({ settings, onChange, blocks, updateBlocks }) => {

    const handleInput = (blocks) => {
        updateBlocks(blocks)
    }

    const handleChange = (blocks) => {
        updateBlocks(blocks)
        onChange(serialize(blocks))
    }


    return (
        <div className="laraberg-editor">
            <BlockEditorProvider
                value={blocks}
                onInput={handleInput}
                onChange={handleChange}
                settings={settings}
            >
                <Header.HeaderFill>
                    <Inserter renderToggle={InserterToggle} />
                </Header.HeaderFill>
                <Sidebar.InspectorFill>
                    <BlockInspector />
                </Sidebar.InspectorFill>
                <div className="editor-styles-wrapper">
                    <BlockEditorKeyboardShortcuts />
                    <Popover.Slot
                        // @ts-ignore
                        name="block-toolbar"
                    />
                    <WritingFlow>
                        <ObserveTyping>
                            <BlockList />
                        </ObserveTyping>
                    </WritingFlow>
                    <Popover.Slot />
                </div>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
