import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = (err) => {
    setError(err.response?.data?.error || err.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_DB_URI}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      if (data) navigate("/success");
    } catch (err) {
      handleError(err);
    }
  };

  const responseGoogle = async (response) => {
    try {
      const { credential } = response;
      const { status } = await axios.post(
        `${process.env.REACT_APP_DB_URI}/api/auth/google`,
        { accessToken: credential },
        { withCredentials: true }
      );
      if (status === 200) navigate("/success");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="heading">Sign In</div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input
            required
            className="input"
            type="email"
            name="email"
            placeholder="E-mail"
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <input className="login-button" type="submit" value="Sign In" />
        </form>
        <div className="social-account-container">
          <span className="title">Or Sign in with</span>
          <div className="social-accounts">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                logo_alignment="left"
                className="social-button google"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
