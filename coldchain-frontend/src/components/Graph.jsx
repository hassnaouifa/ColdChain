// src/components/Graph.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const Graph = () => {
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/mesures/");
      const data = res.data;

      if (!data || data.length === 0) return;

      // Trier les données par date
      const sorted = data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      // Créer les gradients dynamiquement (nécessite un canvas temporaire)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const gradientTemp = ctx.createLinearGradient(0, 0, 0, 300);
      gradientTemp.addColorStop(0, "#00eaff");
      gradientTemp.addColorStop(1, "rgba(0,234,255,0)");

      const gradientHum = ctx.createLinearGradient(0, 0, 0, 300);
      gradientHum.addColorStop(0, "#ff9a00");
      gradientHum.addColorStop(1, "rgba(255,154,0,0)");

      setChartData({
        labels: sorted.map(
          (d) =>
            new Date(d.created_at).toLocaleDateString("fr-FR") +
            " " +
            new Date(d.created_at).toLocaleTimeString("fr-FR")
        ),
        datasets: [
          {
            label: "Température (°C)",
            data: sorted.map((d) => d.temp),
            borderColor: "#00eaff",
            backgroundColor: gradientTemp,
            fill: true,
            tension: 0.5,
            pointRadius: 0,
            borderWidth: 3
          },
          {
            label: "Humidité (%)",
            data: sorted.map((d) => d.hum),
            borderColor: "#ff9a00",
            backgroundColor: gradientHum,
            fill: true,
            tension: 0.5,
            pointRadius: 0,
            borderWidth: 3
          }
        ]
      });
    } catch (err) {
      console.log("Erreur API :", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    animation: { duration: 1200, easing: "easeOutQuart" },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        backgroundColor: "white",
        titleColor: "black",
        bodyColor: "#333",
        padding: 10
      },
      zoom: {
        zoom: { wheel: { enabled: true }, mode: "x" },
        pan: { enabled: true, mode: "x" }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#333" }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#333" }
      }
    }
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "40px auto",
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Température & Humidité — Dashboard
      </h2>

      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p style={{ textAlign: "center" }}>Chargement...</p>
      )}
    </div>
  );
};

export default Graph;
