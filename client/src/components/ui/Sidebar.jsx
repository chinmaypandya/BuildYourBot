import React, { useState } from "react";
import "./Sidebar.css";
import { PiGraph } from "react-icons/pi";
import { BsNodePlus } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoHomeOutline } from "react-icons/io5";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  async function signOutUser(event) {
    event.preventDefault();
    const { error } = await supabase.auth.signOut();
    Cookies.remove('access_token'); 

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      navigate("/");
    }
  }

  const toggleGraphOptions = () => {
    setIsGraphOpen(!isGraphOpen);
  };

  return (
    <div
      className={`sidebar ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="top-section">
        <div className="sidebar-item">
          <IoHomeOutline />
          {isHovered && <span>Home</span>}
        </div>
        <div className="sidebar-item" onClick={toggleGraphOptions}>
          <PiGraph />
          {isHovered && <span>Graph</span>}
        </div>
        {isGraphOpen && (
          <div className="graph-options">
            <div className="sidebar-item">
              {isHovered && <span>• Graph Option 1</span>}
            </div>
            <div className="sidebar-item">
              {isHovered && <span>• Graph Option 2</span>}
            </div>
            {/* Add more options as needed */}
          </div>
        )}
        <div className="sidebar-item">
          <BsNodePlus />
          {isHovered && <span>Node</span>}
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
          <a href="#" onClick={signOutUser}>
            <MdLogout />
            {isHovered && <span>Logout</span>}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
