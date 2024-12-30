import React, { useState, useEffect } from "react";
import Profiles from "./Profile.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", form);
      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/profile");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} id="login-details">
        <input
          name="email"
          onChange={handleChange}
          placeholder="poppy@example.com"
          required
        />
        <input
          name="password"
          onChange={handleChange}
          placeholder="12345"
          type="password"
          required
        />
        <button type="submit">Sign in</button>
      </form>
      <p id="error">{error ? error : ""}</p>
    </div>
  );
};

export default Login;
