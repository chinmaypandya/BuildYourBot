import { Handle, Position } from 'reactflow';

export const SimpleNode = ({ id, data }) => {
  return (
    <div style={{ width: 200, height: 120, border: '1px solid white', borderRadius:8,display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:20 }}>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ top: '50%' }}
      />
      <div>
        <span>Simple</span>
      </div>
      <div>
        <span>A simple process node.</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output-1`}
        style={{ top: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output-2`}
        style={{ top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output-3`}
        style={{ top: '75%' }}
      />
    </div>
  );
};
