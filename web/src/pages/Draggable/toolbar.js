// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='simple_node' label='Simple' />
                <DraggableNode type='router_node' label='Router' />
                <DraggableNode type='react_node' label='React' />
                {/* <DraggableNode type='customSimple' label='Simple' /> */}
            </div>
        </div>
    );
};
