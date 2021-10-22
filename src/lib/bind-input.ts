class BindInput {
    element: HTMLInputElement|HTMLTextAreaElement

    constructor(element: HTMLInputElement|HTMLTextAreaElement) {
        if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {
            throw new Error('[BlockEditor] provided element should be an input or textarea element')
        }

        this.element = element
    }

    getValue = (): string|null => {
        switch(this.element.tagName) {
            case 'INPUT': return this.element.value
            case 'TEXTAREA': return this.element.innerText
            default: return null;
        }
    }

    setValue = (value: string) => {
        switch(this.element.tagName) {
            case 'INPUT':
                this.element.value = value
                break;
            case 'TEXTAREA':
                this.element.innerText = value
        }

        this.element.dispatchEvent(new Event('change'))
    }

    getElement(): HTMLInputElement|HTMLTextAreaElement {
        return this.element
    }
}

export default BindInput
