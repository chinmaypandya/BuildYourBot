// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'start', flexWrap: 'wrap', gap: '10px', marginLeft:100 }}>
                <DraggableNode type='customInput' label='Node' />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customRouter' label='Router' />
                <DraggableNode type='customReact' label='React' />
                <DraggableNode type='customSimple' label='Simple' />
            </div>
        </div>
    );
};
