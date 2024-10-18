import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Success from "./pages/Success";
import "./App.css";
import Sidebar from "./components/ui/Sidebar";
import { PipelineToolbar } from './Drag/toolbar';
import { PipelineUI } from './Drag/ui';
import { SubmitButton } from './Drag/submit';
import { useStore } from './Drag/store'; 
function App() {
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route
        path="/success"
        element={
          <>
          <div id={theme}>
                <div>
                  <Sidebar />
                </div>
                <div>
                  <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                  > 
                    {theme === "light" ? "Dark Theme" : "Light Theme"}
                  </button>
                  <PipelineToolbar />
                </div>
                <div>
                  <PipelineUI />
                  <SubmitButton />
                </div>
              </div>
          </>
        }
      />
      </Routes>
    </Router>
  );
}

export default App;
