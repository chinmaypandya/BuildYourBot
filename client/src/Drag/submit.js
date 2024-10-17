import axios from 'axios';
import { useState } from 'react';
import {useStore } from './store';

export const SubmitButton = () => {
    const [response, setResponse] = useState(null);
    const { nodes, edges } = useStore();
    const [imageData, setImageData] = useState(null); // State for storing image

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
                    target: edge.target
                })),
                name: "test-graph",
                description: "Testing",
                userId: "af889217-172a-4599-925a-61f75f7089a7"
            };

            const result = await axios.post('http://localhost:4000/api/graph/submit', payload);
            setResponse(result.data);
            console.log(result.data);

            alert("Hierarchy pushed to DB successfully!");
        } catch (error) {
            console.error("Error submitting the pipeline:", error);
        }
    };

    const handleCreateGraph = async () => {
        try {
            const payload = {
                graph_id: response.graphId,
                nodes: response.allnodes,
                name: "test-graph",
                description: "testing"
            };

            const result = await axios.post('http://localhost:3004/v1/chat/graph/create', payload, { responseType: 'arraybuffer' });

            // Convert bytes to Base64
            const imageBlob = new Blob([result.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageData(imageUrl); // Set image URL to state

            // Show alert when image is ready
            alert("Graph created successfully. Opening the image in a new tab...");
            
            // Open the image in a new window
            window.open(imageUrl, "_blank");
        } catch (error) {
            console.error("Error creating the graph:", error);
        }
    };

    return (
        <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <button 
                type="button" 
                onClick={handleSubmit} 
                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '5px', transition: 'background-color 0.3s, transform 0.2s'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'green'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'} 
            >
                Submit
            </button>
            <button 
                type="button" 
                onClick={handleCreateGraph} 
                style={{ backgroundColor: '#007BFF', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '5px', transition: 'background-color 0.3s, transform 0.2s'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'blue'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'} 
            >
                Create Graph
            </button>
        </div>
        </>
    );
};
