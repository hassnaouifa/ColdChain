// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig"; // utiliser config avec token
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState({});
  const [mesures, setMesures] = useState([]);
  const [interval, setInterval] = useState("day");

  // Récupérer info utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Veuillez vous connecter !");
      return;
    }

    axios.get(`/users/${userId}/`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  // Récupérer mesures
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get(`/mesures/stats/${interval}/`)
      .then(res => setMesures(res.data))
      .catch(err => console.error(err));
  }, [interval]);

  const data = {
    labels: mesures.map(m => new Date(m.timestamp).toLocaleString()),
    datasets: [
      {
        label: "Température (°C)",
        data: mesures.map(m => m.temperature),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
      {
        label: "Humidité (%)",
        data: mesures.map(m => m.humidity),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      }
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenue {user.username} (Rôle: {user.role_name})</h2>
      <div>
        <label>Filtrer par: </label>
        <select value={interval} onChange={e => setInterval(e.target.value)}>
          <option value="hour">Heure</option>
          <option value="day">Jour</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
      </div>
      <Line data={data} />
    </div>
  );
};

export default UserDashboard;
