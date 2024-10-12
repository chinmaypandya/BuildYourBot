import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Success from "./pages/Success";
import "./App.css";
import Sidebar from "./components/ui/Sidebar";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route
          path="/success"
          element={
            <>
              <Sidebar />
              <Success />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
