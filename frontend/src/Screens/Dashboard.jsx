import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseApi } from "../utils/baseApi";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const [bookStats, setBookStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    booksByCategory: [],
    availablePercentage: 0,
    issuedPercentage: 0,
  });
  const [popularBooks, setPopularBooks] = useState([]);

  const fetchData = async () => {
    toast.loading("Loading Dashboard");
    try {
      const [
        issuedResponse,
        studentsResponse,
        adminResponse,
        bookStatsResponse,
        popularBooksResponse,
      ] = await Promise.all([
        axios.get(`${baseApi}/book-allotment/count`),
        axios.get(`${baseApi}/user/count`),
        axios.get(`${baseApi}/admin/count`),
        axios.get(`${baseApi}/book/stats`),
        axios.get(`${baseApi}/book/popular`),
      ]);

      setData([
        { title: "Total Books", value: issuedResponse.data.data.totalBooks },
        {
          title: "Available Books",
          value: issuedResponse.data.data.availableBooks,
        },
        {
          title: "Currently Issued",
          value: bookStatsResponse.data.data.issuedBooks,
        },
        {
          title: "Due Today",
          value: bookStatsResponse.data.data.dueToday,
        },
        {
          title: "Overdue",
          value: bookStatsResponse.data.data.overdue,
        },
        {
          title: "Due Next Week",
          value: bookStatsResponse.data.data.dueNextWeek,
        },
        { title: "Students", value: studentsResponse.data.data },
        { title: "Admins", value: adminResponse.data.data },
      ]);

      setBookStats(bookStatsResponse.data.data);
      setPopularBooks(popularBooksResponse.data.data);
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
    <main className="w-full p-6 bg-gray-50">
      <p className="font-semibold text-2xl mb-8 text-gray-800">
        Hello, {user?.name}👋
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {item.title}
            </h3>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Book Distribution
          </h2>
          <div className="h-[300px]">
            {bookStats.availableBooks || bookStats.issuedBooks ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: `Available (${bookStats.availablePercentage}%)`,
                        value: bookStats.availableBooks,
                      },
                      {
                        name: `Issued (${bookStats.issuedPercentage}%)`,
                        value: bookStats.issuedBooks,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}`}
                  >
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ff7300" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Books by Category
          </h2>
          <div className="h-[300px]">
            {bookStats.booksByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookStats.booksByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalCount" name="Total Books" fill="#8884d8" />
                  <Bar
                    dataKey="availableCount"
                    name="Available"
                    fill="#82ca9d"
                  />
                  <Bar dataKey="issuedCount" name="Issued" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">⚠️</span> Low Stock Books
          </h2>
          <div className="space-y-4">
            {bookStats.lowStockBooks?.length > 0 ? (
              bookStats.lowStockBooks.map((book, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      Category: {book.category}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        book.stock === 0 ? "text-red-600" : "text-orange-600"
                      }`}
                    >
                      {book.stock} copies left
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">👥</span> Most Active Users
          </h2>
          <div className="space-y-4">
            {bookStats.activeUsers?.length > 0 ? (
              bookStats.activeUsers.map((user, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm font-medium text-blue-600">
                      {user.activeBooks} books issued
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">📚</span> Recent Returns
          </h2>
          <div className="space-y-4">
            {bookStats.recentReturns?.length > 0 ? (
              bookStats.recentReturns.map((return_, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900">
                    {return_.bookTitle}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      Returned by: {return_.userName}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {new Date(return_.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">📊</span> Category Demand
          </h2>
          <div className="space-y-4">
            {bookStats.categoryDemand?.length > 0 ? (
              bookStats.categoryDemand.map((category, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900">
                    {category.category}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">Total Issues</p>
                    <p className="text-sm font-medium text-purple-600">
                      {category.totalIssues} times
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">📈</span> Popular Books
          </h2>
          <div className="space-y-4">
            {popularBooks?.length > 0 ? (
              popularBooks.map((book, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      Author: {book.author}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Issued {book.issueCount} times
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
