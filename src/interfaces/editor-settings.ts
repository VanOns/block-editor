import MediaUpload from "./media-upload";
import { FetchHandler } from './fetch-handler'

export default interface EditorSettings {
    mediaUpload?: (upload: MediaUpload) => void,
    fetchHandler?: FetchHandler,
    disabledCoreBlocks?: string[]
}

