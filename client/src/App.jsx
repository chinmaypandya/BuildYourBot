import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Success from "./pages/Success";
import "./App.css";
import Sidebar from "./components/ui/Sidebar";
import { PipelineToolbar } from './Drag/toolbar';
import { PipelineUI } from './Drag/ui';
import { SubmitButton } from './Drag/submit';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route
        path="/success"
        element={
          <>
          <div>
            <Sidebar/>
          </div>
          <div>
            <PipelineToolbar />
            <PipelineUI />
            <SubmitButton />
          </div>
          </>
        }
      />
      </Routes>
    </Router>
  );
}

export default App;
