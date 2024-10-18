import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';

// Zustand store for managing nodes and edges
export const useStore = create((set, get) => ({
    // Initial state from sessionStorage or empty arrays
    nodes: JSON.parse(sessionStorage.getItem('nodes')) || [],
    edges: JSON.parse(sessionStorage.getItem('edges')) || [],
    nodeIDs: {},
    theme: "dark", 


    // Toggles the theme between 'light' and 'dark'
    toggleTheme: () => {
      set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
      }));
    },

    // Generates a unique ID for a new node based on its type
    getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        newIDs[type] = (newIDs[type] || 0) + 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
    },

    // Adds a new node and updates sessionStorage
    addNode: (node) => {
        set((state) => {
            const updatedNodes = [...state.nodes, node];
            sessionStorage.setItem('nodes', JSON.stringify(updatedNodes));
            return { nodes: updatedNodes };
        });
    },

    // Handles changes to nodes (e.g., position updates)
    onNodesChange: (changes) => {
        set((state) => {
            const updatedNodes = applyNodeChanges(changes, state.nodes);
            sessionStorage.setItem('nodes', JSON.stringify(updatedNodes));
            return { nodes: updatedNodes };
        });
    },

    // Handles changes to edges (e.g., connection updates)
    onEdgesChange: (changes) => {
        if (!Array.isArray(changes)) {
            console.error('Expected changes to be an array', changes);
            return; // Exit early if changes is not an array
        }
        set((state) => {
            const updatedEdges = applyEdgeChanges(changes, state.edges);
            sessionStorage.setItem('edges', JSON.stringify(updatedEdges));
            return { edges: updatedEdges };
        });
    },

    // Connects nodes and adds a new edge
    onConnect: (connection) => {
        set((state) => {
            const updatedEdges = addEdge({
                ...connection,
                type: 'smoothstep',
                animated: true,
                markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px", color:"#9a9999"},
          style: { stroke: '#9a9999', strokeWidth: 2 }, 
            }, state.edges);
            sessionStorage.setItem('edges', JSON.stringify(updatedEdges));
            return { edges: updatedEdges };
        });
    },

    // Updates a specific field of a node
    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => 
                node.id === nodeId ? { ...node, data: { ...node.data, [fieldName]: fieldValue }} : node
            );
            sessionStorage.setItem('nodes', JSON.stringify(updatedNodes));
            return { nodes: updatedNodes };
        });
    },

    // Updates multiple fields of a node
    updateNodeFields: (nodeId, fields) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => 
                node.id === nodeId ? { ...node, data: { ...node.data, ...fields }} : node
            );
            sessionStorage.setItem('nodes', JSON.stringify(updatedNodes));
            return { nodes: updatedNodes };
        });
    },

    // Sets nodes and updates sessionStorage
    setNodes: (nodes) => {
        set({ nodes });
        sessionStorage.setItem('nodes', JSON.stringify(nodes));
    },

    // Sets edges and updates sessionStorage
    setEdges: (edges) => {
        set({ edges });
        sessionStorage.setItem('edges', JSON.stringify(edges));
    },
}));
