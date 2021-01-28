import { createElement } from '@wordpress/element'
import {
    BlockEditorKeyboardShortcuts,
    BlockEditorProvider,
    BlockInspector,
    BlockList,
    Inserter,
    ObserveTyping,
    WritingFlow
} from '@wordpress/block-editor';
import { serialize } from '@wordpress/blocks';
import { KeyboardShortcuts, Popover } from '@wordpress/components'

import Sidebar from './Sidebar'
import Header from './Header'

const BlockEditor = ({ settings, onChange, blocks, updateBlocks }) => {

    const onInput = (blocks) => {
        updateBlocks(blocks)
        onChange(serialize(blocks))
    }

    return (
        <div className="laraberg-editor">
            <BlockEditorProvider
                value={blocks}
                onInput={onInput}
                onChange={(blocks) => onChange(serialize(blocks))}
                //settings={settings}
            >
                <Header.HeaderFill>
                    <Inserter />
                </Header.HeaderFill>
                <Sidebar.InspectorFill>
                    <BlockInspector />
                </Sidebar.InspectorFill>
                <div className="editor-styles-wrapper">
                    <BlockEditorKeyboardShortcuts/>
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
