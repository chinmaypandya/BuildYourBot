import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "./Login.css";
import Cookies from "js-cookie";
function Login() {
  // State for form inputs and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Hook for navigation
  const navigate = useNavigate();

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${process.env.REACT_APP_DB_URI}/api/auth/login`, {
        email,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        const accessToken = Cookies.get('access_token'); // Retrieve access token
        console.log("Access Token:", accessToken);
        navigate("/success"); // Navigate to home page
      }
    } catch (err) {
      // Set error message based on the response
      setError("Login failed: " + err.response?.data?.error || err.message);
    }
  };

  // Handle Google login response
  const responseGoogle = async (response) => {
    try {
      const { credential } = response;
      const res = await axios.post(`${process.env.REACT_APP_DB_URI}/api/auth/google`, { accessToken: credential }, { withCredentials: true });

      if (res.status === 200) {
        const accessToken = Cookies.get('access_token'); // Retrieve access token
        console.log("Access Token:", accessToken);
        navigate("/success"); // Navigate to home page
      }
    } catch (error) {
      console.error("Google login failed:", error);
      // Set error message based on the response
      setError("Google login failed: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="heading">Sign In</div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>} {/* Display error message */}
        
        {/* Form for email/password login */}
        <form className="form" onSubmit={handleSubmit}>
          <input
            required
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
          <input className="login-button" type="submit" value="Sign In" /> {/* Submit button */}
        </form>
        
        {/* Google login section */}
        <div className="social-account-container">
          <span className="title">Or Sign in with</span>
          <div className="social-accounts">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={responseGoogle} // Handle success response
                onFailure={responseGoogle} // Handle failure response
                logo_alignment="left"
                className="social-button google"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
