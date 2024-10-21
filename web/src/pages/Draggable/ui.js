import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { Node } from './nodes/inputNode';
import { RouterNode } from './nodes/routerNode';
import { ReactNode } from './nodes/reactNode';
import 'reactflow/dist/style.css';

const GRID_SIZE = 50; // Size of the grid for snapping nodes
const PRO_OPTIONS = { hideAttribution: true }; // Pro options for ReactFlow

// Mapping node types to their corresponding components
const NODE_TYPES = {
  simple_node: Node,
  router_node: RouterNode,
  react_node: ReactNode,
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
  theme: state.theme,
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
    onConnect,
    theme,
  } = useStore(selector, shallow);

  // Initialize node data
  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
  });

  // Handle dropping a node onto the ReactFlow canvas
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    const dataTransfer = event.dataTransfer.getData('application/reactflow');
    if (dataTransfer) {
      const appData = JSON.parse(dataTransfer);
      const { nodeType: type } = appData || {};

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

  // Define connection line style based on the theme
  const connectionLineStyle = {
    stroke: theme === 'dark' ? '#fff' : '#000',
    strokeWidth: 2,
  };

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
        nodeTypes={NODE_TYPES}
        proOptions={PRO_OPTIONS}
        snapGrid={[GRID_SIZE, GRID_SIZE]} 
        connectionLineType='smoothstep' 
        connectionLineStyle={connectionLineStyle}
      >
        <Background gap={GRID_SIZE} style={{ stroke: '#9a9999', strokeWidth: 3 }} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
