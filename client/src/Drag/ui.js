import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { Node } from './nodes/inputNode';
import { RouterNode } from './nodes/routerNode';
import { ReactNode } from './nodes/reactNode';
import { SimpleNode } from './nodes/simpleNode';

import 'reactflow/dist/style.css';

const gridSize = 50; // Size of the grid for snapping nodes
const proOptions = { hideAttribution: true }; // Pro options for ReactFlow

// Mapping node types to their corresponding components
const nodeTypes = {
  simple_node: Node,
  router_node: RouterNode,
  react_node: ReactNode,
  // Add other node types here as needed
};

// Selector for Zustand store state
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null); // Ref to the ReactFlow wrapper
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // State for ReactFlow instance

  // Destructure necessary state and actions from the store
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  // Function to initialize node data
  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: `${type}`,
  });

  // Handle dropping a node onto the ReactFlow canvas
  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    
    // Check if a node is being dropped
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;

      if (!type) return; // Exit if node type is undefined

      // Calculate the position where the node should be placed
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node data and add it to the store
      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };
      
      addNode(newNode);
    }
  }, [reactFlowInstance, addNode, getNodeID]);

  // Handle drag over event to enable dropping
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Load nodes and edges from session storage on mount
  useEffect(() => {
    const savedNodes = sessionStorage.getItem('nodes');
    const savedEdges = sessionStorage.getItem('edges');

    if (savedNodes) {
      onNodesChange(JSON.parse(savedNodes));
    }
    if (savedEdges) {
      onEdgesChange(JSON.parse(savedEdges));
    }
  }, [onNodesChange, onEdgesChange]);

  // Save nodes and edges to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('nodes', JSON.stringify(nodes));
    sessionStorage.setItem('edges', JSON.stringify(edges));
  }, [nodes, edges]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '95vw', height: '80vh', marginLeft: '70px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]} // Enable snapping to grid
        connectionLineType='smoothstep' // Type of connection line
      >
        <Background color="#fff" gap={gridSize} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
