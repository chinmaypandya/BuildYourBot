import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';

import { useStore } from './pages/Draggable/store'; 
import { PipelineToolbar } from "./pages/Draggable/toolbar";
import { PipelineUI } from "./pages/Draggable/ui";
import { SubmitButton } from "./pages/Draggable/submit";
import Sidebar from "./components/ui/Sidebar";
import Login from "./pages/Login/Login";
import Graph from "./pages/Graph/Graph";
import GraphHistory from "./pages/Graph/GraphHistory";
import "./App.css";


// Route constants
const ROUTES = {
  HOME: "/",
  GRAPH: "/graph/:graphId",
  GRAPHS: "/graphs",
  SUCCESS: "/success",
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

const App = () => {
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Login />} />
        <Route path={ROUTES.GRAPH} element={<GraphPage />} />
        <Route path={ROUTES.GRAPHS} element={<GraphIDPage />} />
        <Route
          path={ROUTES.SUCCESS}
          element={
            <div id={theme}>
              <Sidebar />
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {theme === "light" ? "Dark Theme" : "Light Theme"}
              </button>
              <PipelineToolbar />
              <PipelineUI />
              <SubmitButton />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
