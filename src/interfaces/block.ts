export default interface Block {
    clientId: string | null,
    attributes: any,
    innerBlocks: Block[],
    isValid: boolean,
    name: string
}