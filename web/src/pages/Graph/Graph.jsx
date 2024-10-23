import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useStore } from '../Draggable/store'; // Import your Zustand store
import { PipelineToolbar } from "../Draggable/toolbar";
import { PipelineUI } from "../Draggable/ui";
import { SubmitButton } from "../Draggable/submit";
import GraphSidebar from '../../components/ui/GraphSidebar';

const Graph = ({ graphId }) => {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphCreated, setGraphCreated] = useState(false); // Track graph creation
  const isMounted = useRef(true);
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  const GRAPH_API_URL = `http://localhost:3003/api/graph/${graphId}`;
  const CREATE_GRAPH_API_URL = 'http://localhost:3000/ai/v1/chat/graph/create';

  const fetchGraphData = useCallback(async () => {
    try {
      const response = await axios.get(GRAPH_API_URL);
      if (isMounted.current) {
        setGraphData(response.data);
        console.log(response.data.edges);
        const edgesWithHandles = response.data.edges.map(edge => {
          const sourceHandle = edge.source + "-output";
          const targetHandle = edge.target + "-input";

          return {
            ...edge,
            sourceHandle,
            targetHandle,
            type: "smoothstep",
            style: { stroke: "#9a9999", strokeWidth: 2 },
            animated: true,
            id: "reactflow__edge-" + edge.source + sourceHandle + "-" + edge.target + targetHandle
          };
        });

        const nodeIdMap = {};
        response.data.nodes.forEach(node => {
          nodeIdMap[node.id] = node;
        });

        const nodesWithPosition = response.data.nodes.map(node => {
          const updatedNode = {
            id: node.id,
            type: node.nodeType || "simple_node",
            position: node.position || { x: 0, y: 0 },
            positionAbsolute: node.position || { x: 0, y: 0 },
            dragging: false,
            selected: false,
            data: {
              id: node.id,
              name: node.name,
              persona: node.persona,
              dos: node.dos,
              donts: node.donts,
              example: node.example,
            }
          };

          edgesWithHandles.forEach(edge => {
            if (edge.source_id === node.id) {
              updatedNode.id = edge.source;
            } else if (edge.target_id === node.id) {
              updatedNode.id = edge.target;
            }
          });

          return updatedNode;
        });

        setEdges(edgesWithHandles);
        setNodes(nodesWithPosition);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [GRAPH_API_URL, setEdges, setNodes]);

  useEffect(() => {
    isMounted.current = true;
    fetchGraphData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchGraphData]);

  useEffect(() => {
    if (graphData && !graphCreated) {
      handleCreateGraph(graphData);
      setGraphCreated(true);
    }
  }, [graphData, graphCreated]);

  const handleCreateGraph = async (data) => {
    try {
      const payload = {
        graph_id: data.graphId,
        nodes: data.nodes,
        name: "test-graph",
        description: "Testing",
      };

      const result = await axios.post(CREATE_GRAPH_API_URL, payload, { responseType: 'arraybuffer' });
      const imageBlob = new Blob([result.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      window.open(imageUrl, "_blank");
    } catch (error) {
      console.error("Error creating the graph:", error);
      if (isMounted.current) {
        setError("Error creating the graph");
      }
    }
  };

  useEffect(() => {
    if (graphData) {
      console.log("Graph Data:", graphData);
    }
  }, [graphData]);

  if (loading) {
    return <div>Loading graph data...</div>;
  }

  if (error) {
    return <div>Error loading graph: {error}</div>;
  }

  return (
    <div>
      <GraphSidebar/>
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === "light" ? "Dark Theme" : "Light Theme"}
      </button>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      {/* Render your graph visualization or data here */}
    </div>
  );
};

export default Graph;
