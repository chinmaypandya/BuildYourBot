// SubmitButton.js

import axios from 'axios';
import { useState } from 'react';
import { useStore } from './store';
import './SubmitButton.css'; // Import CSS file for styling

export const SubmitButton = () => {
    const [response, setResponse] = useState(null);
    const { nodes, edges } = useStore();

    // eslint-disable-next-line
    const [imageData, setImageData] = useState(null); 

    // Handle submitting the pipeline
    const handleSubmit = async () => {
        if (!nodes || !edges) {
            console.error("Nodes or edges are undefined!");
            return;
        }

        try {
            const payload = {
                nodes: nodes.map(node => ({
                    id: node.id,
                    data: {
                        name: node.data.name,
                        persona: node.data.persona,
                        dos: node.data.dos,
                        donts: node.data.donts,
                        example: node.data.example
                    }
                })),
                edges: edges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    sourceName: edge.sourceName,
                    targetName: edge.targetName
                })),
                name: "test-graph",
                description: "Testing",
                userId: "1abfbb49-f964-42ed-a5a7-6acbcde61387"
            };

            const result = await axios.post('http://localhost:4000/api/graph/submit', payload);
            setResponse(result.data);
            console.log(result.data);

            alert("Hierarchy pushed to DB successfully!");
        } catch (error) {
            console.error("Error submitting the pipeline:", error);
            alert("Failed to submit the pipeline. Please try again.");
        }
    };

    // Handle creating the graph
    const handleCreateGraph = async () => {
        if (!response) {
            console.error("No response available to create graph!");
            return;
        }

        try {
            const payload = {
                graph_id: response.graphId,
                nodes: response.nodes,
                name: "test-graph",
                description: "testing"
            };
            console.log("payload",payload);
            const result = await axios.post('http://localhost:3004/v1/chat/graph/create', payload, { responseType: 'arraybuffer' });

            const imageBlob = new Blob([result.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageData(imageUrl);

            alert("Graph created successfully. Opening the image in a new tab...");
            window.open(imageUrl, "_blank");
        } catch (error) {
            console.error("Error creating the graph:", error);
            alert("Failed to create the graph. Please try again.");
        }
    };

    // Reusable button component
    const Button = ({ onClick, label, backgroundColor, hoverColor }) => (
        <button 
            type="button" 
            onClick={onClick} 
            className="custom-button" 
            style={{ backgroundColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = backgroundColor}
        >
            {label}
        </button>
    );

    return (
        <div className="button-container">
            <Button 
                onClick={handleSubmit} 
                label="Submit" 
                backgroundColor="#4CAF50" 
                hoverColor="green" 
            />
            <Button 
                onClick={handleCreateGraph} 
                label="Create Graph" 
                backgroundColor="#007BFF" 
                hoverColor="blue" 
            />
        </div>
    );
    
};
