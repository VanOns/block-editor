import { createElement } from '@wordpress/element'
import { createSlotFill, Panel } from '@wordpress/components';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
    'StandAloneBlockEditorSidebarInspector'
);

const Sidebar = ({ }) => {
    return (
        <div
            className="laraberg-sidebar"
            role="region"
            aria-label={'Standalone Block Editor advanced settings.'}
            tabIndex={-1}
        >
            <Panel header={'Inspector'}>
                <InspectorSlot bubblesVirtually />
            </Panel>
        </div>
    );
};

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
