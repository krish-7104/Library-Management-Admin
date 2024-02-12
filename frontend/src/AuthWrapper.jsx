import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseApi } from "./utils/baseApi";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/NavBar";
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkTokenHandler = async (token) => {
      try {
        const resp = await axios.get(`${baseApi}/admin/auth/get-user`, {
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
  return (
    <main className="flex flex-col">
      <Navbar />
      <section className="flex">
        <Sidebar />
        <div className="w-[80%]">{children}</div>
      </section>
    </main>
  );
};

export default AuthWrapper;
