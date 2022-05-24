import '../src/styles.scss'
import * as BlockEditor from '../src/index'

const { hooks } = BlockEditor.wordpress

hooks.addFilter('blocks.registerBlockType', 'block-editor', (settings, blockName) => {
    return settings
})

document.addEventListener('block-editor/init', e => {
    console.log(e)
})

const form = document.getElementById('form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('submit', e)
})

const element = document.getElementById('content');
element.addEventListener('change', (e) => {
    console.log(e.target.value)
})

const settings = {
    mediaUpload: ({filesList, onFileChange}) => {
        const files = Array.from(filesList).map(window.URL.createObjectURL)

        onFileChange(files)

        setTimeout(() => {
            const uploadedFiles = Array.from(filesList).map(file => {
                return {
                    id: file.name,
                    name: file.name,
                    url: `https://dummyimage.com/600x400/000/fff&text=${file.name}`
                }
            })
            onFileChange(uploadedFiles)
        }, 1000)
    }
}
BlockEditor.initializeEditor(element, settings);

