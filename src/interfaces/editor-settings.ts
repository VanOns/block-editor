import MediaUpload from "./media-upload";

export default interface EditorSettings {
    mediaUpload?: (upload: MediaUpload) => void
}

