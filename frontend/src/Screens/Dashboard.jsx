import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashCard from "../Components/Dashboard/DashCard";
import axios from "axios";
import { baseApi } from "../utils/baseApi";

const Dashboard = () => {
  const user = useSelector((state) => state.userSlice.data);
  const [data, setData] = useState([
    { title: "Books", value: 10 },
    { title: "Issued", value: 10 },
    { title: "Fines", value: 10 },
    { title: "Students", value: 10 },
    { title: "Allotments", value: 10 },
  ]);

  const fetchData = async () => {
    try {
      const booksResponse = await axios.get(`${baseApi}/book/count`);
      const issuedResponse = await axios.get(`${baseApi}/book-allotment/count`);
      const finesResponse = await axios.get(`${baseApi}/fines/count`);
      const studentsResponse = await axios.get(`${baseApi}/user/count`);

      setData([
        { title: "Books", value: booksResponse.data.data },
        { title: "Allotments", value: issuedResponse.data.data.allotments },
        { title: "Issued", value: issuedResponse.data.data.issuedBook },
        { title: "Fines", value: finesResponse.data.data },
        { title: "Students", value: studentsResponse.data.data },
      ]);
    } catch (error) {
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
