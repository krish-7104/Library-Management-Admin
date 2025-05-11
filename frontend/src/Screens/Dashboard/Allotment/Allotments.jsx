import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import { Search, Filter, Clock, BookOpen, User } from "lucide-react";

const Allotments = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    returnFilter: "all",
    sortBy: "newest",
  });

  useEffect(() => {
    getAllotmentHandler();
  }, [filters.returnFilter]);

  const getAllotmentHandler = async () => {
    setLoading(true);
    toast.loading("Loading Allotments...");
    try {
      let resp = "";
      if (filters.returnFilter !== "all") {
        resp = await axios.get(
          `${baseApi}/book-allotment/allotments?returned=${filters.returnFilter}`
        );
      } else {
        resp = await axios.get(`${baseApi}/book-allotment/allotments`);
      }
      setAllotments(resp.data.data);
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const getSortedAllotments = (allotments) => {
    const sorted = [...allotments];
    switch (filters.sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "returnDate":
        return sorted.sort(
          (a, b) => new Date(a.returnDate) - new Date(b.returnDate)
        );
      default:
        return sorted;
    }
  };

  const filteredAllotments = getSortedAllotments(
    allotment.filter((item) =>
      item.user.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  );

  return (
    <DashboardWrapper title={"Book Allotments"}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                className="px-3 py-2 rounded-lg border-2 outline-none text-sm w-64"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by student name"
                value={filters.search}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500" size={20} />
                <select
                  className="px-3 py-2 rounded-lg border-2 outline-none text-sm"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="returnDate">Return Date</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-2 rounded-lg border-2 outline-none text-sm"
                  value={filters.returnFilter}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      returnFilter: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Allotments</option>
                  <option value="true">Returned</option>
                  <option value="false">Not Returned</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredAllotments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No allotments found
                    </td>
                  </tr>
                ) : (
                  filteredAllotments.map((item) => {
                    const isOverdue =
                      !item.returned && new Date() > new Date(item.returnDate);
                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.user.enrollmentno}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.book.image}
                              alt={item.book.name}
                              className="h-16 w-12 object-cover rounded"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.book.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.book.author}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>
                                Issued: {dateFormatter(item.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock size={14} />
                              <span>Due: {dateFormatter(item.returnDate)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.returned
                                ? "bg-green-100 text-green-800"
                                : isOverdue
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.returned
                              ? "Returned"
                              : isOverdue
                              ? "Overdue"
                              : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Allotments;
