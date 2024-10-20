import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Graph = ({ graphId }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null); // State for the image data
  const isMounted = useRef(true); // Ref to track mounted status

  useEffect(() => {
    isMounted.current = true; // Set mounted to true when component mounts

    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/graph/${graphId}`);
        if (isMounted.current) {
          setGraphData(response.data);
          await handleCreateGraph(response.data); // Pass the graph data here
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
    };

    fetchGraphData();

    return () => {
      isMounted.current = false; // Cleanup function to set the ref to false
    };
  }, [graphId]);

  const handleCreateGraph = async (graphData) => {
    setLoading(true);
    try {
      const payload = {
        graph_id: graphData.graphId, // Ensure graphId is part of your data
        nodes: graphData.allnodes,
        name: "test-graph",
        description: "testing"
      };

      const result = await axios.post('http://localhost:3004/v1/chat/graph/create', payload, { responseType: 'arraybuffer' });
      const imageBlob = new Blob([result.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageData(imageUrl);
      alert("Graph created successfully. Opening the image in a new tab...");
      window.open(imageUrl, "_blank");
    } catch (error) {
      console.error("Error creating the graph:", error);
      if (isMounted.current) {
        setError("Error creating the graph");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading graph data...</div>;
  }

  if (error) {
    return <div>Error loading graph: {error}</div>;
  }

  return (
    <div>
      <h2>Graph: {graphId}</h2>
      {/* Render the graph data */}
      <pre>{JSON.stringify(graphData, null, 2)}</pre>
      {/* You can replace the above with a proper graph rendering */}
    </div>
  );
};

export default Graph;
