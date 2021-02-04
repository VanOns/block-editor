import { createReduxStore, register } from '@wordpress/data'

import actions from './actions'
import reducer from './reducer'
import selectors from './selectors'

const store = createReduxStore('laraberg', {
    reducer,
    actions,
    selectors
})

register(store)