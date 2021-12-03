import EditorSettings from "../interfaces/editor-settings";

const defaultSettings: EditorSettings = {
    height: '500px',
    mediaUpload: undefined,
    disabledCoreBlocks: [
        'core/embed',
        'core/freeform',
        'core/shortcode',
        'core/archives',
        'core/tag-cloud',
        'core/block',
        'core/rss',
        'core/search',
        'core/calendar',
        'core/categories',
        'core/more',
        'core/nextpage'
    ]
}

export default defaultSettings
