import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";
import Swal from "sweetalert2";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import { Search, AlertCircle, Clock } from "lucide-react";

const ReturnBook = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    overdueOnly: false,
  });

  useEffect(() => {
    getAllotmentHandler();
  }, []);

  const getAllotmentHandler = async () => {
    setLoading(true);
    toast.loading("Loading Allotments...");
    try {
      const resp = await axios.get(
        `${baseApi}/book-allotment/allotments?returned=false`
      );
      setAllotments(resp.data.data);
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const confirmHandler = (id) => {
    Swal.fire({
      title: "Return Book",
      text: "Are you sure you want to return this book?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return Book",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        returnBookHandler(id);
      }
    });
  };

  const returnBookHandler = async (id) => {
    toast.loading("Returning Book...");
    try {
      const resp = await axios.post(
        `${baseApi}/book-allotment/return-book/${id}`
      );
      toast.dismiss();
      if (resp.status === 409) {
        Swal.fire({
          title: "Not Allotment Found!",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: resp.data.message,
          icon: "success",
        });
      }
      getAllotmentHandler();
    } catch (error) {
      toast.dismiss();
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  const filteredAllotments = allotment.filter((item) => {
    const matchesSearch = item.user.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const isOverdue = new Date() > new Date(item.returnDate);
    return matchesSearch && (!filters.overdueOnly || isOverdue);
  });

  return (
    <DashboardWrapper title={"Return Book"}>
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
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-violet-600"
                  checked={filters.overdueOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      overdueOnly: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm text-gray-600">Show overdue only</span>
              </label>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredAllotments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No books found for return
                    </td>
                  </tr>
                ) : (
                  filteredAllotments.map((item) => {
                    const isOverdue = new Date() > new Date(item.returnDate);
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
                              isOverdue
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isOverdue ? "Overdue" : "On Time"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => confirmHandler(item._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                          >
                            Return Book
                          </button>
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

export default ReturnBook;
