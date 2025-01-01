import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useStore } from './pages/Draggable/store'; 
import { PipelineToolbar } from './pages/Draggable/toolbar';
import { PipelineUI } from './pages/Draggable/ui';
import { SubmitButton } from './pages/Draggable/submit';
import Login from './pages/Login/Login';
import Graph from './pages/Graph/Graph';
import GraphHistory from './pages/Graph/GraphHistory';
import './App.css';
import Register from './pages/Login/Register';
import GraphSidebar from './components/ui/GraphSidebar';

// Route constants
const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  GRAPH: "/graph/:graphId",
  GRAPHS: "/graphs",
  LOGIN: "/login"
};

const isAuthenticated = async () => {
  const sessionToken = Cookies.get('session_token');
  
  if (!sessionToken) {
    console.log("No session token found.");
    return false; 
  }

  try {
    const response = await fetch('http://localhost:3002/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    
    if (response.status !== 200) {
      console.error('Token verification failed with status:', response.status);
      return false; 
    }

    const data = await response.json();
    
    return data.decoded.userId  ? true : false;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return false;
  }
};

const GraphPage = () => {
  const { theme } = useStore(state => ({ theme: state.theme }));
  const { graphId } = useParams();

  return (
    <div id={theme}>
      <Graph graphId={graphId} />
    </div>
  );
};

const GraphIDPage = () => {
  const { theme } = useStore(state => ({ theme: state.theme }));
  const sessionToken = Cookies.get('session_token');
  let decodedUserId;

  if (sessionToken) {
    try {
      const { userId } = jwtDecode(sessionToken);
      decodedUserId = userId;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  return (
    <div id={theme}>
      <GraphHistory userId={decodedUserId} />
    </div>
  );
};

const SuccessPage = () => {
  const { theme, toggleTheme } = useStore(state => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <div id={theme}>
      <GraphSidebar />
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
      </button>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
};

// Wrapper component to handle auth state
const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticatedResult = await isAuthenticated();
      setAuthState(isAuthenticatedResult);
    };

    checkAuth();
  }, []);

  if (authState === null) {
    return <div>Loading...</div>;
  }

  if (authState === true) {
    return children;
  } else {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.GRAPH} element={<GraphPage />} />
        <Route path={ROUTES.GRAPHS} element={<GraphIDPage />} />
        
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
