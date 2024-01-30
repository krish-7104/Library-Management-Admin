import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";
import Swal from "sweetalert2";
const ReturnBook = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);

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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return Book!",
    }).then((result) => {
      returnBookHandler(id);
    });
  };

  const returnBookHandler = async (id) => {
    toast.loading("Returning Book...");
    try {
      const resp = await axios.post(
        `${baseApi}/book-allotment/return-book/${id}`
      );
      toast.dismiss();
      if (resp.status === 204) {
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
                      {item.books[0].name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {dateFormatter(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {dateFormatter(item.returnDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        onClick={() => confirmHandler(item._id)}
                        className="inline-block rounded bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {allotment && allotment.length === 0 && (
        <p className="text-center mt-10 text-gray-700">
          No Allotments Available!
        </p>
      )}
    </main>
  );
};

export default ReturnBook;
