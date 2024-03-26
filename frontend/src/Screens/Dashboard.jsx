import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashCard from "../Components/Dashboard/DashCard";
import axios from "axios";
import { baseApi } from "../utils/baseApi";
import toast from "react-hot-toast";
const Dashboard = () => {
  const user = useSelector((state) => state.userSlice.data);
  const [data, setData] = useState([
    { title: "Books", value: 0 },
    { title: "Issued", value: 0 },
    { title: "Fines", value: 0 },
    { title: "Students", value: 0 },
    { title: "Allotments", value: 0 },
    { title: "Book Category", value: 0 },
    { title: "Admins", value: 0 },
  ]);

  const fetchData = async () => {
    toast.loading("Loading Dashboard");
    try {
      const booksResponse = await axios.get(`${baseApi}/book/count`);
      const issuedResponse = await axios.get(`${baseApi}/book-allotment/count`);
      const finesResponse = await axios.get(`${baseApi}/fines/count`);
      const studentsResponse = await axios.get(`${baseApi}/user/count`);
      const categoryResponse = await axios.get(`${baseApi}/category/count`);
      const adminResponse = await axios.get(`${baseApi}/admin/count`);

      setData([
        { title: "Books", value: booksResponse.data.data },
        { title: "Book Category", value: categoryResponse.data.data },
        { title: "Allotments", value: issuedResponse.data.data.allotments },
        { title: "Issued", value: issuedResponse.data.data.issuedBook },
        { title: "Fines", value: finesResponse.data.data },
        { title: "Students", value: studentsResponse.data.data },
        { title: "Admins", value: adminResponse.data.data },
      ]);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="w-full p-6">
      <p className="font-semibold text-xl">Hello, {user?.name}👋</p>
      <section className="grid grid-cols-4 place-items-center bg-slate-50 my-5 gap-6">
        {data.map((item, index) => (
          <DashCard title={item.title} number={item.value} key={index} />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
