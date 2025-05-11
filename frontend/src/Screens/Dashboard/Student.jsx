import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApi } from "../../utils/baseApi";
import { Send, Search, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    enrollmentNo: "",
    fineFilter: "all",
    slotFilter: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    getStudentHandler();
  }, []);

  const getStudentHandler = async () => {
    setLoading(true);
    toast.loading("Loading Students..");
    try {
      const resp = await axios.get(`${baseApi}/user/allusers`);
      setStudents(resp.data.data);
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...students];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [students, sortConfig]);

  const filteredStudents = sortedStudents.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesEnrollment = item.enrollmentno
      .toString()
      .includes(filters.enrollmentNo);
    const matchesFine =
      filters.fineFilter === "all"
        ? true
        : filters.fineFilter === "high"
        ? item.fine > 100
        : item.fine <= 100;
    const matchesSlot =
      filters.slotFilter === "all"
        ? true
        : filters.slotFilter === "available"
        ? item.bookSlot > 0
        : item.bookSlot === 0;

    return matchesSearch && matchesEnrollment && matchesFine && matchesSlot;
  });

  const clearFilters = () => {
    setFilters({
      search: "",
      enrollmentNo: "",
      fineFilter: "all",
      slotFilter: "all",
    });
  };

  return (
    <main className="min-h-[90vh] bg-gray-100 flex justify-center pt-4">
      <div className="w-[95%] flex justify-start items-center flex-col">
        <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                className="px-3 py-2 rounded-lg border-2 outline-none text-sm w-64"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by name"
                value={filters.search}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="px-3 py-2 rounded-lg border-2 outline-none text-sm w-48"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    enrollmentNo: e.target.value,
                  }))
                }
                placeholder="Enrollment No"
                value={filters.enrollmentNo}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-lg border-2 outline-none text-sm"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fineFilter: e.target.value,
                  }))
                }
                value={filters.fineFilter}
              >
                <option value="all">All Fines</option>
                <option value="high">High Fines ({">"}100)</option>
                <option value="low">Low Fines (≤100)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-lg border-2 outline-none text-sm"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    slotFilter: e.target.value,
                  }))
                }
                value={filters.slotFilter}
              >
                <option value="all">All Slots</option>
                <option value="available">Available Slots</option>
                <option value="unavailable">No Slots</option>
              </select>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              <X size={16} />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("enrollmentno")}
                  >
                    Enrollment No{" "}
                    {sortConfig.key === "enrollmentno" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("fine")}
                  >
                    Fine{" "}
                    {sortConfig.key === "fine" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("bookSlot")}
                  >
                    Slot Available{" "}
                    {sortConfig.key === "bookSlot" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.enrollmentno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.phonenumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.fine > 100
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          ₹{item.fine}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.bookSlot > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.bookSlot}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            navigate("/dashboard/send-message", {
                              state: {
                                email: item.email,
                                eno: item.enrollmentno,
                                name: item.name,
                              },
                            })
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                          <Send size={14} className="mr-1" />
                          Message
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Student;
