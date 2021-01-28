import { createElement } from '@wordpress/element'
import { Button, createSlotFill } from '@wordpress/components'

const { Slot: HeaderSlot, Fill: HeaderFill } = createSlotFill(
    'HeaderToolbar'
);

const Cog = () => {
    return (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path fillRule="evenodd" d="M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd"></path></svg>
    )
}

const Header = ({ toggleSidebar }) => {
    return (
        <div
            className="laraberg-header flex justify-between"
            role="region"
            aria-label={'Block Editor top bar.'}
            tabIndex={-1}
        >

            <div className="laraberg-header__toolbar">
                <HeaderSlot bubblesVirtually />
            </div>
            <Button onClick={toggleSidebar} icon={<Cog />} label={'Settings'} />
        </div>
    );
};

Header.HeaderFill = HeaderFill;

export default Header;
