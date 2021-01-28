import { createElement } from '@wordpress/element'
import { Button } from '@wordpress/components'
import { plus as plusIcon } from '@wordpress/icons'

const InserterToggle = ({onToggle, isOpen, toggleProps}) => {
    return (
        <Button 
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