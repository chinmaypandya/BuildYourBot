import { Handle, Position } from 'reactflow';

export const ReactNode = ({ id, data }) => {
  return (
    <div style={{ width: 200, height: 120, border: '1px solid white', borderRadius:8,display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:20 }}>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ top: '50%' }}
      />
      <div>
        <span>React</span>
      </div>
      <div>
        <span>Handles React logic.</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output-1`}
        style={{ top: '50%' }}
      />
    </div>
  );
};
