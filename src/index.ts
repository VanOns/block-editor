import { init } from './components/Editor'

// @ts-ignore
window.process = { env: { FORCE_REDUCED_MOTION: false } }

class Laraberg {
    static init(selector: string) {
        init(selector)
    }
}

export default Laraberg