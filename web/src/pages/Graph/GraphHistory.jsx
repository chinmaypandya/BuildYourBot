import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './GraphHistory.css'; // Importing the CSS file for styling

const GraphHistory = ({ userId }) => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/graph/user/${userId}`);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Network response was not ok');
        }
        setGraphData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="graph-container">
      <h1>Graphs for User: {userId}</h1>
      {graphData && graphData.graphIds.length > 0 ? (
        <ul className="graph-list">
          {graphData.graphIds.map(graph => (
            <li key={graph.id} className="graph-item">
              <Link to={`/graph/${graph.id}`} className="graph-link">
                <div className="graph-id-name">
                    <h2>Graph Id: {graph.id}</h2>
                    <h2>Name: {graph.name}</h2>   
                </div>
                <div className="graph-desc">
                    <h2>Description: {graph.description}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No graph data available.</p>
      )}
    </div>
  );
};

export default GraphHistory;
