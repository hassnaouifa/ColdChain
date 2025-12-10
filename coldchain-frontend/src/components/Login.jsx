// src/components/Login.jsx
import React, { useState } from "react";
import axios from "../axiosConfig"; // utiliser config avec token
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // envoyer le login via form-data classique (session)
    const res = await axios.post("/api-auth/login/", {
      username,
      password,
    });

    alert("Connexion réussie!");
    navigate(`/dashboard/${username}`);
  } catch (err) {
    setError("Nom d'utilisateur ou mot de passe incorrect");
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-login">Connexion</button>
      </form>
    </div>
  );
};

export default Login;
