import { __ } from '@wordpress/i18n'
import { createElement, useEffect, useCallback } from '@wordpress/element'
import { useDispatch, useSelect } from '@wordpress/data'

import { useShortcut, store } from '../keyboard-shortcuts'

const KeyboardShortcuts = () => {
    const { undo, redo, removeBlocks, removeBlock, duplicateBlocks } = useDispatch('laraberg')
    const { multiSelect } = useDispatch('core/block-editor')
    const { selectedBlockIds, firstSelectedBlockId, blockIds } = useSelect((select) => {
        const { getSelectedBlockClientIds, getBlockOrder } = select('core/block-editor')
        const selectedBlockIds = getSelectedBlockClientIds()
        const [firstSelectedBlockId] = selectedBlockIds
        return {
            selectedBlockIds,
            firstSelectedBlockId,
            blockIds: getBlockOrder(),
        }
    }, [])

    useShortcut(
        'laraberg/undo',
        useCallback((event: Event) => {
            event.preventDefault()
            undo()
        }, [undo]),
        { bindGlobal: true }
    )

    useShortcut(
        'laraberg/redo',
        useCallback((event: Event) => {
            event.preventDefault()
            redo()
        }, [redo]),
        { bindGlobal: true }
    )

    useShortcut(
        'core/block-editor/duplicate',
        useCallback((event: Event) => {
            event.preventDefault()
            duplicateBlocks(selectedBlockIds)
        }, [selectedBlockIds, duplicateBlocks]),
        { bindGlobal: true, isDisabled: selectedBlockIds.length === 0 }
    )

    useShortcut(
        'core/block-editor/remove',
        useCallback((event: Event) => {
            event.preventDefault()
            removeBlock(firstSelectedBlockId)
        }, [firstSelectedBlockId, removeBlock]),
        { bindGlobal: true, isDisabled: selectedBlockIds.length === 0 }
    )

    useShortcut(
        'core/block-editor/delete-multi-selection',
        useCallback((event: Event) => {
            event.preventDefault()
            removeBlocks(selectedBlockIds)
        }, [selectedBlockIds, removeBlocks]),
        { isDisabled: selectedBlockIds.length < 2 }
    )

    useShortcut(
        'core/block-editor/select-all',
        useCallback((event: Event) => {
            event.preventDefault()
            multiSelect(
                blockIds[0],
                blockIds[blockIds.length - 1]
            )
        }, [blockIds, multiSelect]),
        { bindGlobal: true }
    )

    return <KeyboardShortcutsRegister />
}

const KeyboardShortcutsRegister = () => {
    const { registerShortcut } = useDispatch(store)

    useEffect(() => {
        registerShortcut({
            name: 'laraberg/undo',
            category: 'global',
            description: __('Undo'),
            keyCombination: {
                modifier: 'primary',
                character: 'z',
            },
        })

        registerShortcut({
            name: 'laraberg/redo',
            category: 'global',
            description: __('Redo'),
            keyCombination: {
                modifier: 'primaryShift',
                character: 'z',
            },
        })

        registerShortcut( {
			name: 'core/block-editor/duplicate',
			category: 'block',
			description: __( 'Duplicate the selected block(s).' ),
			keyCombination: {
				modifier: 'primaryShift',
				character: 'd',
			},
		} );

        registerShortcut({
            name: 'core/block-editor/remove',
            category: 'block',
            description: __('Remove the selected block(s).'),
            keyCombination: {
                modifier: 'access',
                character: 'z',
            },
        })

        registerShortcut({
            name: 'core/block-editor/delete-multi-selection',
            category: 'block',
            description: __('Remove multiple selected blocks.'),
            keyCombination: {
                character: 'del',
            },
            aliases: [
                {
                    character: 'backspace',
                },
            ],
        })

        registerShortcut({
            name: 'core/block-editor/select-all',
            category: 'selection',
            description: __('Select all text when typing. Press again to select all blocks.'),
            keyCombination: {
                modifier: 'primary',
                character: 'a',
            },
        })
    }, [registerShortcut])

    return null
}

export default KeyboardShortcuts