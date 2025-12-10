// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const [latest, setLatest] = useState(null);
  const navigate = useNavigate();

  const loadLatest = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/mesures/");
      const data = res.data;

      if (data && data.length > 0) {
        // Trier par date pour s'assurer que la dernière mesure est récupérée
       const sorted = data.sort(
       (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    setLatest(sorted[sorted.length - 1]); 
      }
    } catch (e) {
      console.log("Erreur API :", e);
    }
  };

  useEffect(() => {
    loadLatest();
    const interval = setInterval(loadLatest, 5000); // rafraîchissement toutes les 5s
    return () => clearInterval(interval);
  }, []);

  const getElapsed = (timestamp) => {
    if (!timestamp) return "--";
    const now = moment();
    const date = moment(timestamp);
    const diff = moment.duration(now.diff(date));

    if (diff.asSeconds() < 60)
      return `${Math.floor(diff.asSeconds())} seconde(s) (${date.format(
        "HH:mm"
      )})`;
    if (diff.asMinutes() < 60)
      return `il y a ${Math.floor(diff.asMinutes())} minute(s) (${date.format(
        "HH:mm"
      )})`;
    if (diff.asHours() < 24)
      return `il y a ${Math.floor(diff.asHours())} heure(s) (${date.format(
        "HH:mm"
      )})`;
    return `il y a ${Math.floor(diff.asDays())} jour(s) (${date.format(
      "HH:mm"
    )})`;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1>Dashboard Température & Humidité (DHT11)</h1>
      <div className="cards-container">
        <div className="card">
          <div className="header">Température</div>
          <div className="value">{latest ? latest.temp + " °C" : "-- °C"}</div>
          <div className="time">{latest ? getElapsed(latest.timestamp) : "--"}</div>
        </div>
        <div className="card">
          <div className="header">Humidité</div>
          <div className="value">{latest ? latest.hum + " %" : "-- %"}</div>
          <div className="time">{latest ? getElapsed(latest.timestamp) : "--"}</div>
        </div>
      </div>
      <button onClick={() => navigate("/graph")} className="graph-button">
        Voir Graphique 30 derniers jours
      </button>
    </div>
  );
};

export default Dashboard;