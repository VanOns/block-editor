import { createElement } from '@wordpress/element'
import { createSlotFill, Panel } from '@wordpress/components'

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
    'StandAloneBlockEditorSidebarInspector'
)

const Sidebar = () => {
    return (
        <div
            className="block-editor__sidebar"
            role="region"
        >
            <Panel header={'Inspector'}>
                <InspectorSlot bubblesVirtually />
            </Panel>
        </div>
    );
};

Sidebar.InspectorFill = InspectorFill

export default Sidebar
