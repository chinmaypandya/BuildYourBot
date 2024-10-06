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
      // Decode the token and get the email
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded); // Assuming the email is in the decoded token
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/");
      }
    }
  }, [navigate]);

  // async function getUserData() {
  //   const { data } = await supabase.auth.getUser();
  //   if (data?.user) {
  //     console.log(data.user);
  //     setUser(data.user);
  //   }
  // }

  // async function signOutUser() {
  //   const { error } = await supabase.auth.signOut();
  //   if (!error) {
  //     Cookies.remove('access_token'); 
  //     navigate("/"); 
  //   }
  // }

  return (
    <div className="container">
      {user ? ( 
        <>
          {/* <h1>Success</h1> */}
          <p>Welcome, {user.email}!</p> 
          {/* <button onClick={signOutUser}>Sign Out</button> */}
        </>
      ):(
        <>
          <h1>Log</h1>
          {/* <button onClick={signOutUser}>Sign Out</button> */}
        </>
      )}
    </div>
  );
}

export default Success;
