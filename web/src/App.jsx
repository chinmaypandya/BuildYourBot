import { PipelineToolbar } from "./Drag/toolbar";
import { PipelineUI } from "./Drag/ui";
import { SubmitButton } from "./Drag/submit";
import Sidebar from "./components/ui/Sidebar";
import Login from "./pages/Login/Login";
import { useStore } from './Drag/store'; 
import Graph from "./pages/Graph/Graph";
import GraphHistory from "./pages/Graph/GraphHistory";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

function GraphPage(){
  const { theme } = useStore(state => ({ theme: state.theme })); 
  const { graphId } = useParams();

  return(
    <div id={theme}>
      <Graph graphId={graphId}/>
    </div>
  )

}

function GraphIDPage() {
  const { theme } = useStore(state => ({ theme: state.theme })); 
  const sessionToken = Cookies.get('session_token');
  let decodedUserId;

  // console.log("Session Token:", sessionToken);

  if (sessionToken) {
    try {
      const decodedToken = jwtDecode(sessionToken); 
      // console.log("Decoded Token:", decodedToken);
      decodedUserId = decodedToken.userId; 
      // console.log("Decoded User ID:", decodedUserId);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.warn("Session token is undefined. Check if the cookie is set correctly.");
  }

  return (
    <div id={theme}>
      <GraphHistory userId={decodedUserId} />
    </div>
  );
  }
function App() {
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/graph/:graphId" element={<GraphPage />} />
        <Route path="/graphs" element={<GraphIDPage />} />

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
