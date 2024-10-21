import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './GraphHistory.css';

const GraphHistory = ({ userId }) => {
  // State to hold graph data, loading status, and error messages
  const [graphData, setGraphData] = useState({ graphIds: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoint to fetch graphs for a specific user
  const API_URL = `${process.env.REACT_APP_DB_URI}/api/graph/user/${userId}`;
  const ERROR_MESSAGES = {
    network: 'Network response was not ok',
  };

  // useEffect to fetch graph data when the component mounts or when userId changes
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        // Make API call to fetch graph data
        const response = await axios.get(API_URL);
        setGraphData(response.data);
      } catch (err) {
        // Handle errors, setting error state if one occurs
        setError(err.response?.data?.message || ERROR_MESSAGES.network);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [userId, API_URL]); // Dependencies for the effect

  // Render loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Render error state if an error occurred
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Main rendering of graph data
  return (
    <div className="graph-container">
      <h1>Graphs for User: {userId}</h1>
      {graphData.graphIds.length > 0 ? (
        <ul className="graph-list">
          {graphData.graphIds.map(({ id, name, description }) => (
            <li key={id} className="graph-item">
              <Link to={`/graph/${id}`} className="graph-link">
                <div className="graph-id-name">
                  <h2>Graph Id: {id}</h2>
                  <h2>Name: {name}</h2>
                </div>
                <div className="graph-desc">
                  <h2>Description: {description}</h2>
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
