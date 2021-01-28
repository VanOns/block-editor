import {
    Popover,
    SlotFillProvider,
    // @ts-ignore
	__unstableDropZoneContextProvider as DropZoneContextProvider,
} from '@wordpress/components';
import { InterfaceSkeleton, FullscreenMode } from "@wordpress/interface"
import { useState, useEffect, render, createElement, Fragment } from '@wordpress/element'
import { parse } from '@wordpress/blocks'
import {registerCoreBlocks} from '@wordpress/block-library';

import BlockEditor from './BlockEditor'
import Header from './Header'
import Sidebar from './Sidebar'
//import MediaHandler from '../MediaHandler'
import FetchHandler from '../FetchHandler'

FetchHandler.register()

const Editor = ({ settings, onChange, value }) => {
    const [blocks, updateBlocks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false)


    useEffect(() => {
        registerCoreBlocks()

        if (value) {
            updateBlocks(parse(value))
        }
    }, [])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const mediaUpload = (upload) => {
        console.log(upload);
        //(new MediaHandler(resource, field)).upload(upload)
    }

    return (
        <div>
            <FullscreenMode isActive={false} />
            <SlotFillProvider>
                <DropZoneContextProvider>
                    <InterfaceSkeleton
                        header={<Header toggleSidebar={toggleSidebar} />}
                        sidebar={sidebarOpen ? <Sidebar /> : null}
                        content={
                            <Fragment>
                                {/*<Notices/>*/}
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

const init = (selector: string) => {
    const container = document.createElement('div')
    container.classList.add('laraberg-container')

    document.addEventListener('DOMContentLoaded', () => {
        const element: HTMLTextAreaElement|HTMLInputElement|null = document.querySelector(selector);

        if (element === null) {
            console.warn(`[Laraberg] element with selector ${selector} not found.`)
            return
        }

        element.insertAdjacentElement('afterend', container)
        element.style.display = 'none';
    
        render(
            <Editor
                settings={{}}
                onChange={(value) => {
                    switch (element.tagName) {
                        case 'INPUT':
                            element.value = value
                            break;
                        case 'TEXTAREA':
                            element.innerText = value
                            break;
                        default:
                            console.warn('[Laraberg] element is not of type "input" or "textarea"')
                    }
                }}
                value={''}
            />,
            container
        )
    })
}

export default Editor;

export { init }
