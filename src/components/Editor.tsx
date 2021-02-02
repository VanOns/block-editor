import { useState, useEffect, render, createElement, Fragment } from '@wordpress/element'
import {
    Popover,
    SlotFillProvider,
    // @ts-ignore
    __unstableDropZoneContextProvider as DropZoneContextProvider,
} from '@wordpress/components'
import { InterfaceSkeleton, FullscreenMode } from "@wordpress/interface"
import { parse } from '@wordpress/blocks'

import { registerBlocks } from '../lib/blocks'
import BlockEditor from './block-editor'
import Header from './header'
import Sidebar from './sidebar'
import Notices from './notices'
import FetchHandler from '../lib/fetch-handler'
import BindInput from '../lib/bind-input'

FetchHandler.register()

const Editor = ({ settings, onChange, value }) => {
    const [blocks, updateBlocks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        registerBlocks()

        if (value) {
            updateBlocks(parse(value))
        }
    }, [])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const mediaUpload = (upload) => {
        console.log(upload);
    }

    return (
        <div>
            <FullscreenMode isActive={false} />
            <SlotFillProvider>
                <DropZoneContextProvider>
                    <InterfaceSkeleton
                        header={<Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
                        sidebar={sidebarOpen ? <Sidebar /> : null}
                        content={
                            <Fragment>
                                <Notices />
                                <BlockEditor
                                    blocks={blocks}
                                    updateBlocks={updateBlocks}
                                    onChange={onChange}
                                    settings={{
                                        mediaUpload,
                                        ...settings
                                    }}
                                />
                            </Fragment>
                        }
                    />
                    <Popover.Slot />
                </DropZoneContextProvider>
            </SlotFillProvider>
        </div>
    );
};

const initializeEditor = (element: HTMLInputElement | HTMLTextAreaElement) => {
    document.addEventListener('DOMContentLoaded', () => {
        const input = new BindInput(element)

        const container = document.createElement('div')
        container.classList.add('laraberg-container')
        input.getElement().insertAdjacentElement('afterend', container)
        input.getElement().style.display = 'none';

        render(
            <Editor
                settings={{}}
                onChange={input.setValue}
                value={input.getValue()}
            />,
            container
        )
    })
}

export { initializeEditor, Editor }
