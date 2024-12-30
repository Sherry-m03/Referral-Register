import React from "react";
import Login from "./Login.js";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function signUp() {
    navigate("/register");
  }

  return (
    <div className="home">
      <div id="login">
        <Login />
      </div>

      <div id="register">
        <h1>Welcome</h1>
        <h3>Enter your personal details and start your journey with us.</h3>
        <button onClick={signUp}>Sign up</button>
      </div>
    </div>
  );
}
