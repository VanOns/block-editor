import { createElement } from '@wordpress/element'
import { ToolbarButton } from '@wordpress/components'
import { plus as plusIcon } from '@wordpress/icons'

interface InserterToggleProps {
    onToggle: () => void,
    isOpen: boolean,
    toggleProps: any
}

const InserterToggle = ({onToggle, isOpen, toggleProps}: InserterToggleProps) => {
    return (
        <ToolbarButton
            isPrimary={true}
            isPressed={isOpen}
            icon={plusIcon}
            onClick={onToggle}
            label={'Add block'}
            {...toggleProps}
        />
    )
}

export default InserterToggle
