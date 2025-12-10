// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">Monitoring DHT11</div>
      <div className="navbar-buttons">
      <button onClick={() => navigate("/login-user")} className="btn">
        Authentification User
      </button>
        <button
          onClick={() => window.location.href = "http://192.168.1.5:8000/admin/"}
          className="btn admin-btn"
        >
          Authentification Admin
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
