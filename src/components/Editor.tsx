import { useState, useEffect, render, createElement, StrictMode } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { SlotFillProvider } from '@wordpress/components'
import { parse, serialize } from '@wordpress/blocks'
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts'

import '../store'
import { registerBlocks } from '../lib/blocks'
import BlockEditor from './BlockEditor'
import Header from './Header'
import Sidebar from './Sidebar'
import BindInput from '../lib/bind-input'
import EditorSettings from '../interfaces/editor-settings'
import { useSelect, useDispatch } from '@wordpress/data'
import defaultSettings from '../lib/default-settings'
import KeyboardShortcuts from "./KeyboardShortcuts";


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
        registerBlocks(settings.disabledCoreBlocks)
        document.addEventListener('click', preventSubmit)

        if (settings.fetchHandler) {
            apiFetch.setFetchHandler(settings.fetchHandler)
        }

        return () => {
            document.removeEventListener('click', preventSubmit)
        }
    }, [])

    useEffect(() => {
        if (value) {
            setBlocks(parse(value))
        }
    }, [value]);

    useEffect(() => {
        onChange(serialize(blocks))
    }, [blocks])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <StrictMode>
            <SlotFillProvider>
                <ShortcutProvider>
                    <div className="block-editor">
                        <KeyboardShortcuts.Register/>
                        <KeyboardShortcuts/>

                        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

                        <div className="block-editor__content">
                            <BlockEditor
                                blocks={blocks}
                                onChange={setBlocks}
                                undo={undo}
                                redo={redo}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                settings={settings}
                            />

                            {sidebarOpen && <Sidebar/>}
                        </div>
                    </div>
                </ShortcutProvider>
            </SlotFillProvider>
        </StrictMode>
    );
};

const initializeEditor = (element: HTMLInputElement | HTMLTextAreaElement, settings: EditorSettings = {}) => {
    const input = new BindInput(element)

    const container = document.createElement('div')
    container.classList.add('block-editor-container')
    input.getElement().insertAdjacentElement('afterend', container)
    input.getElement().style.display = 'none';

    render(
        <Editor
            settings={{...defaultSettings, ...settings}}
            onChange={input.setValue}
            value={input.getValue() || undefined}
        />,
        container
    )
}

const preventSubmit = (event: MouseEvent) => {
    if (
        event.target instanceof Element
        && event?.target?.matches('.block-editor *')
    ) {
        event.preventDefault()
    }
}

export { initializeEditor, Editor }
