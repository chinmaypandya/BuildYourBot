import axios from "axios";
import { useState } from "react";
import { useStore } from "./store";
import "./SubmitButton.css"; 

export const SubmitButton = () => {
  const [response, setResponse] = useState(null);
  const { nodes, edges } = useStore();
  const [graphResponse, setGraphResponse] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Handle submitting the pipeline
  const handleSubmit = async () => {
    if (!nodes || !edges) {
      console.error("Nodes or edges are undefined!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const payload = {
        nodes: nodes.map((node) => ({
          id: node.id,
          data: {
            name: node.data.name,
            persona: node.data.persona,
            dos: node.data.dos,
            donts: node.data.donts,
            example: node.data.example,
          },
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          sourceName: edge.sourceName,
          targetName: edge.targetName,
        })),
        name: "test-graph",
        description: "Testing",
        userId: "1abfbb49-f964-42ed-a5a7-6acbcde61387",
      };

      const result = await axios.post(
        "http://localhost:4000/api/graph/submit",
        payload
      );
      setResponse(result.data);
      console.log(result.data);
      alert("Hierarchy pushed to DB successfully!");
    } catch (error) {
      console.error("Error submitting the pipeline:", error);
      alert("Failed to submit the pipeline. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle creating the graph
  const handleCreateGraph = async () => {
    if (!response) {
      console.error("No response available to create graph!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const payload = {
        graph_id: response.graphId,
        nodes: response.nodes,
        name: "test-graph",
        description: "testing",
      };
      setGraphResponse(payload);
      const result = await axios.post(
        "http://localhost:3000/ai/v1/chat/graph/create",
        payload,
        { responseType: "arraybuffer" }
      );

      const imageBlob = new Blob([result.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageData(imageUrl);
      console.log("Image URL:", imageUrl);
      alert("Graph created successfully. Opening the image in a new tab...");
      window.open(imageUrl, "_blank");
    } catch (error) {
      console.error("Error creating the graph:", error);
      alert("Failed to create the graph. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChat = async () => {
    if (!graphResponse) {
      console.error("No graph response available to create graph!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const url = `http://localhost:3000/c/?graph_id=${graphResponse.graph_id}`;
      window.location.replace(url);
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Failed to open chat. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Reusable button component
  const Button = ({ onClick, label, backgroundColor, hoverColor, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      className="custom-button"
      style={{ backgroundColor }}
      disabled={disabled} // Disable button when loading
      onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = backgroundColor)}
    >
      {label}
    </button>
  );

  return (
    <>
      {loading && (
        <div className="overlay">
          <div className="loader"></div> {/* Loading animation */}
        </div>
      )}
      <div className="button-container">
        <Button
          onClick={handleSubmit}
          label="Submit"
          backgroundColor="#4CAF50"
          hoverColor="green"
          disabled={loading} // Disable when loading
        />
        <Button
          onClick={handleCreateGraph}
          label="Create Graph"
          backgroundColor="#007BFF"
          hoverColor="blue"
          disabled={loading} // Disable when loading
        />
      </div>
      {imageData && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'column'
          }}
        >
          <img
            src={imageData}
            alt="Generated graph"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <Button
            onClick={handleChat}
            label="Chat"
            backgroundColor="#007BFF"
            hoverColor="blue"
            disabled={loading} // Disable when loading
          />
        </div>
      )}
    </>
  );
};
