export default interface MediaUpload {
    allowedTypes: string[],
    filesList: FileList,
    onError: (message: string) => void,
    onFileChange: () => void
}