import { createElement } from '@wordpress/element'
import { createSlotFill, Panel } from '@wordpress/components'

const { Slot, Fill } = createSlotFill(
    'StandAloneBlockEditorSidebarInspector'
)

const Sidebar = () => {
    return (
        <div
            className="block-editor__sidebar"
            role="region"
        >
            <Panel header={'Inspector'}>
                <Slot bubblesVirtually />
            </Panel>
        </div>
    );
};

Sidebar.Fill = Fill

export default Sidebar
