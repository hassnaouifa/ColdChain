import React, { useEffect, useState, useRef } from "react";
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
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://192.168.221.172:8000/api/mesures/")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, "#00eaff");
    gradient1.addColorStop(1, "rgba(0,234,255,0)");

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, "#ff9a00");
    gradient2.addColorStop(1, "rgba(255,154,0,0)");

    setChartData({
      labels: data.map((d) =>
        new Date(d.created_at).toLocaleDateString("fr-FR")
      ),
      datasets: [
        {
          label: "Température (°C)",
          data: data.map((d) => d.temp),
          borderColor: "#00eaff",
          backgroundColor: gradient1,
          fill: true,
          tension: 0.5,
          pointRadius: 0,
          borderWidth: 3
        },
        {
          label: "Humidité (%)",
          data: data.map((d) => d.hum),
          borderColor: "#ff9a00",
          backgroundColor: gradient2,
          fill: true,
          tension: 0.5,
          pointRadius: 0,
          borderWidth: 3
        }
      ]
    });
  }, [data]);

  const options = {
    responsive: true,
    animation: { duration: 1200, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
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
        margin: "auto",
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Température & Humidité — Dashboard
      </h2>

      {chartData ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <p style={{ textAlign: "center" }}>Chargement...</p>
      )}
    </div>
  );
};

export default Graph;
