import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    rcode: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Phone number must be 10 digits.");
      return;
    }
    try {
      const res = await axios.post("/register", form);
      if (res.status === 201) {
        navigate(-1);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="home">
      <div id="register2">
        <div id="register-details">
          <h1>Signing up</h1>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              id="phone-city"
              name="phone"
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <input
              id="phone-city"
              name="city"
              onChange={handleChange}
              placeholder="City"
              required
            />
            <input
              name="rcode"
              onChange={handleChange}
              placeholder="Referral Code"
            />
            <div style={{ position: "relative" }}>
              <input
                type="password"
                onChange={handleChange}
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" id="sign-up-btn">
              Register
            </button>
          </form>
          <p id="error">{error ? error : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
