import { Button, createSlotFill } from '@wordpress/components'
import { createElement } from '@wordpress/element'
import { cog as cogIcon } from '@wordpress/icons'

const { Slot: HeaderSlot, Fill: HeaderFill } = createSlotFill(
    'HeaderToolbar'
);

const Header = ({ toggleSidebar, sidebarOpen }) => {
    return (
        <div
            className="laraberg-header flex justify-between"
            role="region"
        >
            <div className="laraberg-header__toolbar">
                <HeaderSlot bubblesVirtually />
            </div>
            <Button onClick={toggleSidebar} isPressed={sidebarOpen} icon={cogIcon} label={'Settings'} />
        </div>
    );
};

Header.HeaderFill = HeaderFill;

export default Header;
