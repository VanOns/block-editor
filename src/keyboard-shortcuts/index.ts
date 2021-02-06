import { useSelect, register } from '@wordpress/data'
import { store } from '@wordpress/keyboard-shortcuts'
import { useKeyboardShortcut } from '@wordpress/compose'

register(store)

const useShortcut = (name, callback, options = {}) => {
    const shortcuts = useSelect(function (select) {
      return select(store).getAllShortcutRawKeyCombinations(name);
    }, [name]);
    useKeyboardShortcut(shortcuts, callback, options);
}

export { store, useShortcut }