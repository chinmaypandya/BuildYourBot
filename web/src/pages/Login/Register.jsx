import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = (err) => {
    setError(err.response?.data?.error || err.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_DB_URI}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      if (data) {
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 5000);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="heading">Register</div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        
        {showConfirmation && (
          <div className="confirmation-popup">
            <p>A confirmation email has been sent. Please check your inbox.</p>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <input
            required
            className="input"
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input className="register-login-button" type="submit" value="Register" />
        </form>
        <div className="register-login-link">
          <p>Already have an account? <a href="/">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
