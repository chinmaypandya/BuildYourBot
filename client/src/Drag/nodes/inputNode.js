import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './Node.css'; 

export const Node = ({ id, data }) => {
  const [persona, setPersona] = useState(data?.persona || '');
  const [dos, setDos] = useState(data?.dos || '');
  const [donts, setDonts] = useState(data?.donts || '');
  const [example, setExample] = useState(data?.example || '');

  return (
    <div className="node-container">
      <div className="node-header">
        <span>Node</span>
      </div>
      <div className="node-input">
        <label>
          Persona:
          <input
            type="text"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Who are you"
          />
        </label>
      </div>
      <div className="node-input">
        <label>
          Do's:
          <input
            type="text"
            value={dos}
            onChange={(e) => setDos(e.target.value)}
            placeholder="Tasks"
          />
        </label>
      </div>
      <div className="node-input">
        <label>
          Don'ts:
          <input
            type="text"
            value={donts}
            onChange={(e) => setDonts(e.target.value)}
            placeholder="Warnings"
          />
        </label>
      </div>
      <div className="node-input">
        <label>
          Example:
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="Example"
          />
        </label>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ background: '#555' }}
      />
    </div>
  );
};
