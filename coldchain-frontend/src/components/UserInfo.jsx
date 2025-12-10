// src/components/UserInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8000/api/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <div className="user-info">
      <h2>Bonjour, {user.username}</h2>
      <p>Rôle : {user.role_name}</p>
    </div>
  );
};

export default UserInfo;
