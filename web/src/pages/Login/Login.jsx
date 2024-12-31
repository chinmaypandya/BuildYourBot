import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      if (data) navigate("/");
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
          <input className="register-login-button" type="submit" value="Sign In" onClick={handleSubmit}/>
        </form>
        <div className="register-login-link">
        <p>Create new account <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
