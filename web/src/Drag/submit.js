import axios from 'axios';
import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const [response, setResponse] = useState(null);
    const { nodes, edges } = useStore();

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
                        persona: node.data.persona,
                        dos: node.data.dos,
                        donts: node.data.donts,
                        example: node.data.example
                    }
                })),
                edges: edges.map(edge => ({
                    source: edge.source,
                    target: edge.target
                }))
            };

            const result = await axios.post(`${process.env.REACT_APP_DB_URI}/api/graph/submit`, payload);

            setResponse(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error submitting the pipeline:", error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <button 
                type="button" 
                onClick={handleSubmit} 
                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '5px', transition: 'background-color 0.3s, transform 0.2s'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'green'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'} 
            >
                Submit
            </button>
            {response && (
                <div>
                    <h3>Hierarchy:</h3>
                    <pre>{JSON.stringify(response.hierarchy, null, 2)}</pre>
                    <p>Number of nodes: {response.num_nodes}</p>
                    <p>Number of edges: {response.num_edges}</p>
                    <p>Is DAG: {response.is_dag ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};