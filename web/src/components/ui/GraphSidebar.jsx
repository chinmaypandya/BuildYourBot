import React, { useState } from "react";
import "./Sidebar.css"; // Import CSS for styling
import { MdOutlineSettings, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoHomeOutline } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios for API calls

const GraphSidebar = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); // State to track hover status

  const handleNavigate = () => {
    navigate("/graphs"); // Navigate to the /graphs page
  };

  // Function to sign out the user
  const signOutUser = async (event) => {
    event.preventDefault();

    try {
      // Make API call to logout
      const response = await axios.post(`${process.env.REACT_APP_DB_URI}/api/auth/logout`, {}, { withCredentials: true });

      // If logout is successful
      if (response.status === 200) {
        Cookies.remove('access_token'); // Remove the access token cookie
        Cookies.remove('session_token'); // Remove the session token cookie
        navigate("/"); // Redirect to home or login page
      }
    } catch (error) {
      console.error("Error signing out:", error.response?.data?.error || error.message); // Log error
    }
  };


  return (
    <div
      className={`sidebar ${isHovered ? "hovered" : ""}`} // Apply hovered class conditionally
      onMouseEnter={() => setIsHovered(true)} // Handle mouse enter
      onMouseLeave={() => setIsHovered(false)} // Handle mouse leave
    >
      <div className="top-section">
        {/* Sidebar items */}
        <div className="sidebar-item" onClick={() => navigate("/success")}>
          <IoHomeOutline />
          {isHovered && <span>Home</span>}
        </div>
        <div className="sidebar-item" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
          <FaHistory />
          {isHovered && <span>History</span>}
        </div>
      </div>

      <div className="bottom-section">
        <div className="sidebar-item">
          {isHovered && <span>Authentication</span>}
        </div>
        <div className="separator"></div>

        <div className="sidebar-item">
          <MdOutlineSettings />
          {isHovered && <span>Settings</span>}
        </div>
        <div className="sidebar-item">
          <CgProfile />
          {isHovered && <span>Profile</span>}
        </div>
        <div className="sidebar-item">
          <button onClick={signOutUser} className="logout-button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <MdLogout />
            {isHovered && <span className="logout">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphSidebar;
