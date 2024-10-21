import { Handle, Position } from "reactflow";

export const RouterNode = ({ id, data }) => {
  return (
    <>
      <div
        style={{
          width: 200,
          height: 120,
          border: "1px solid white",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div>
          <span>Router</span>
        </div>
        <div>
          <span>Handles routing logic.</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output-1`}
        style={{ top: "50%" }}
      />
    </>
  );
};
