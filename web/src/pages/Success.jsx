import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import './Success.css'; 
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

function Success() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
      navigate("/"); 
    } else {
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded); 
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/");
      }
    }
  }, [navigate]);


  return (
    <div className="container">
      {user ? ( 
        <>
          <p>Welcome, {user.email}!</p> 
          {/* <button onClick={signOutUser}>Sign Out</button> */}
        </>
      ):(
        <>
          <h1>Log</h1>
        </>
      )}
    </div>
  );
}

export default Success;
