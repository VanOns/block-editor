import { Button, createSlotFill } from '@wordpress/components'
import { createElement } from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

const { Slot: HeaderSlot, Fill: HeaderFill } = createSlotFill(
    'HeaderToolbar'
);

interface HeaderProps {
    toggleSidebar: () => void,
    sidebarOpen: boolean
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
    return (
        <div
            className="block-editor-header flex justify-between"
            role="region"
        >
            <div className="block-editor-header__toolbar">
                <HeaderSlot bubblesVirtually />
            </div>
            <Button onClick={toggleSidebar} isPressed={sidebarOpen} icon={cogIcon} label={'Settings'} />
        </div>
    );
};

Header.HeaderFill = HeaderFill;

export default Header;
