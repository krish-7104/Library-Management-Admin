import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";

const Allotments = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllotmentHandler();
  }, []);

  const getAllotmentHandler = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${baseApi}/book-allotment/allotments`);
      setAllotments(resp.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-[100vh]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Student Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Book
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Returned
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Allotment Date
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Return Date
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              allotment &&
              allotment.map((item) => {
                return (
                  <tr className="text-center">
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.book.name}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-2 text-gray-900 font-semibold ${
                        item.returned ? "bg-green-300" : "bg-red-300"
                      }`}
                    >
                      {JSON.stringify(item.returned).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {dateFormatter(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {dateFormatter(item.returnDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        href="/"
                        className="inline-block rounded bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {allotment && allotment.length === 0 && (
        <p className="text-center mt-10 text-gray-700">No Allotments Found!</p>
      )}
    </main>
  );
};

export default Allotments;
