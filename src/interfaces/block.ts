export default interface Block {
    attributes: any,
    clientId: string,
    innerBlocks: Block[],
    isValid: boolean,
    name: string
}