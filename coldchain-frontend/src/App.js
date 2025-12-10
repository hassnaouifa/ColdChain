// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Graph from "./components/Graph";
import Login from "./components/Login";
import UserDashboard from "./pages/UserDashboard";
import { useParams } from "react-router-dom";
const UserDashboardWrapper = () => {
  const { userId } = useParams();
  return <UserDashboard userId={userId} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/login-user" element={<Login />} />
        <Route path="/dashboard/:userId" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
