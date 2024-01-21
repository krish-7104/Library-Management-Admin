import React, { useEffect } from "react";
import axios from "axios";
import { baseApi } from "../utils/baseApi.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkTokenHandler = async (token) => {
      try {
        const resp = await axios.get(`${baseApi}/admin/auth/get-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(resp.data.data);
      } catch (error) {
        localStorage.clear();
        navigate("/");
      }
    };
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    checkTokenHandler(token);
  }, [navigate]);

  return <div>Dashboard</div>;
};

export default Dashboard;
