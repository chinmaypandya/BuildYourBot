import { useState } from "react";
import { Handle, Position } from "reactflow";
import "./Node.css";
import { useStore } from "../store";

export const Node = ({ id, data }) => {
  // Initialize state for node properties
  const [nodeData, setNodeData] = useState({
    name: data?.name || "",
    persona: data?.persona || "",
    dos: data?.dos || "",
    donts: data?.donts || "",
    example: data?.example || "",
  });

  const updateNodeFields = useStore((state) => state.updateNodeFields);

  // Handle input change
  const handleChange = (field, value) => {
    setNodeData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Save node data and update store
  const handleSave = () => {
    updateNodeFields(id, nodeData);
    console.log("Saved Node Fields:", nodeData);
  };

  return (
    <>
      <div className="node-container">
        <div className="node-header">
          Node:
          <input
            type="text"
            value={nodeData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Name of the Node"
          />
        </div>

        <>
          <div className="node-input">
            <label>
              Persona:
              <input
                type="text"
                value={nodeData.persona}
                onChange={(e) => handleChange("persona", e.target.value)}
                placeholder="Who are you"
              />
            </label>
          </div>
          <div className="node-input">
            <label>
              Do's:
              <input
                type="text"
                value={nodeData.dos}
                onChange={(e) => handleChange("dos", e.target.value)}
                placeholder="Tasks"
              />
            </label>
          </div>
          <div className="node-input">
            <label>
              Don'ts:
              <input
                type="text"
                value={nodeData.donts}
                onChange={(e) => handleChange("donts", e.target.value)}
                placeholder="Warnings"
              />
            </label>
          </div>
          <div className="node-input">
            <label>
              Example:
              <input
                type="text"
                value={nodeData.example}
                onChange={(e) => handleChange("example", e.target.value)}
                placeholder="Example"
              />
            </label>
          </div>
        </>
        <button className="save" onClick={handleSave}>
          Save
        </button>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ background: "#555" }}
      />
    </>
  );
};
