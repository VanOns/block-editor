import { useState, useEffect, render, createElement, Fragment, StrictMode } from '@wordpress/element'
import { SlotFillProvider } from '@wordpress/components'
import { InterfaceSkeleton } from "@wordpress/interface"
import { parse } from '@wordpress/blocks'
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts'

import '../store'
import { registerBlocks } from '../lib/blocks'
import BlockEditor from './BlockEditor'
import Header from './header'
import Sidebar from './sidebar'
import FetchHandler from '../lib/fetch-handler'
import BindInput from '../lib/bind-input'
import EditorSettings from '../interfaces/editor-settings'
import MediaUpload from '../interfaces/media-upload'
import Block from '../interfaces/block'
import { useSelect, useDispatch } from '@wordpress/data'
import defaultSettings from '../lib/default-settings'

FetchHandler.register()

export interface EditorProps {
    settings: EditorSettings,
    onChange: (value: string) => void,
    value?: string,
}

const Editor = ({ settings, onChange, value }: EditorProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { setBlocks, undo, redo } = useDispatch('block-editor')

    const { blocks, canUndo, canRedo } = useSelect(select => {
        return {
            blocks: select('block-editor').getBlocks(),
            canUndo: select('block-editor').canUndo(),
            canRedo: select('block-editor').canRedo()
        }
    })

    useEffect(() => {
        registerBlocks()

        if (value) {
            setBlocks(parse(value))
        }
    }, [])

    const handleUpdateBlocks = (blocks: Block[]) => {
        setBlocks(blocks)
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <StrictMode>
            <ShortcutProvider>
                <SlotFillProvider>
                    <div className="block-editor">
                        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

                        <div className="block-editor__content">
                            <BlockEditor
                                blocks={blocks}
                                updateBlocks={handleUpdateBlocks}
                                onChange={onChange}
                                undo={undo}
                                redo={redo}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                settings={{...defaultSettings, ...settings}}
                            />

                            {sidebarOpen && <Sidebar/>}
                        </div>
                    </div>
                </SlotFillProvider>
            </ShortcutProvider>
        </StrictMode>
    );
};

const initializeEditor = (element: HTMLInputElement | HTMLTextAreaElement, settings: EditorSettings = {}) => {
    document.addEventListener('DOMContentLoaded', () => {
        const input = new BindInput(element)

        const container = document.createElement('div')
        container.classList.add('block-editor-container')
        input.getElement().insertAdjacentElement('afterend', container)
        input.getElement().style.display = 'none';

        render(
            <Editor
                settings={settings}
                onChange={input.setValue}
                value={input.getValue() || undefined}
            />,
            container
        )
    })
}

export { initializeEditor, Editor }
