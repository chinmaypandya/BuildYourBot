import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './GraphHistory.css';
import Sidebar from '../../components/ui/Sidebar';

const GraphHistory = ({ userId }) => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${process.env.REACT_APP_DB_URI}/api/graph/user/${userId}`;
  const ERROR_MESSAGES = {
    network: 'Something went wrong. Please try again later.',
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setGraphData(response.data.graphIds); 
      } catch (err) {
        setError(err.response?.data?.message || ERROR_MESSAGES.network);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [userId, API_URL]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading your graphs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
    <Sidebar />
    
    <div className="graph-history">
      <h1 className="title">Your Saved Graphs</h1>
      {graphData.length > 0 ? (
        <div className="graph-table-container">
          <table className="graph-table">
            <thead>
              <tr>
                <th>Graph Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {graphData.map(({ id, name, description }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{description}</td>
                  <td>
                    <Link to={`/graph/${id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-graphs">No graphs available. Start creating one!</p>
      )}
    </div>
    </>
  );
};

export default GraphHistory;
