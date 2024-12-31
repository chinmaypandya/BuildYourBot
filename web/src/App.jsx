import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';

import { useStore } from './pages/Draggable/store'; 
import { PipelineToolbar } from "./pages/Draggable/toolbar";
import { PipelineUI } from "./pages/Draggable/ui";
import { SubmitButton } from "./pages/Draggable/submit";
import Login from "./pages/Login/Login";
import Graph from "./pages/Graph/Graph";
import GraphHistory from "./pages/Graph/GraphHistory";
import "./App.css";
import Register from './pages/Login/Register';
import GraphSidebar from './components/ui/GraphSidebar';

// Route constants
const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  GRAPH: "/graph/:graphId",
  GRAPHS: "/graphs",
  LOGIN:"/login"
};

const isAuthenticated = () => {
  const sessionToken = Cookies.get('session_token');
  if (sessionToken) {
    try {
      const decoded = jwtDecode(sessionToken);
      return decoded.userId ? true : false;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return false;
    }
  }
  return false;
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
      console.error("Failed to decode token:", error);
    }
  } else {
    console.warn("Session token is undefined.");
  }

  return (
    <div id={theme}>
      <GraphHistory userId={decodedUserId} />
    </div>
  );
};

const SuccessPage = () => {
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <div id={theme}>
      <GraphSidebar />
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === "light" ? "Dark Theme" : "Light Theme"}
      </button>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
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
            isAuthenticated() ? (
              <SuccessPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace /> )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
