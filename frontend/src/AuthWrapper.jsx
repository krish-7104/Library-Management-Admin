import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseApi } from "./utils/baseApi";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/NavBar";
import { useDispatch } from "react-redux";
import { setData } from "./Redux Toolkit/slice";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkTokenHandler = async (token) => {
      try {
        const resp = await axios.get(`${baseApi}/admin/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setData(resp.data.data));
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
  }, [dispatch, navigate]);

  return (
    <main className="flex flex-col">
      <Navbar />
      <section className="flex overflow-hidden h-[90vh]">
        <Sidebar />
        <div className="w-[80%] overflow-y-auto">{children}</div>
      </section>
    </main>
  );
};

export default AuthWrapper;
