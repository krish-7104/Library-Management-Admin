import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";
import Swal from "sweetalert2";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";

const ReturnBook = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
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

  const filteredAllotments = allotment.filter((item) =>
    item.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardWrapper title={"Return Book"}>
      <div className="">
        <div className="mb-4 flex justify-end items-center">
          <input
            type="text"
            className="w-[30%] px-2 py-[6px] rounded border-2 outline-none text-sm"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Student Name"
            value={search}
          />
        </div>
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Student Name
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Book Image
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Book Name
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Allotment Date
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Return Date
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              filteredAllotments.map((item) => {
                const date = new Date();
                const returnDate = new Date(item.returnDate);
                const isReturnDateGone = returnDate < date;
                return (
                  <tr className={`text-center`} key={item._id}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900 flex justify-center items-center">
                      <img src={item.book.image} alt="book" className="h-32" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.book.name?.slice(0, 30)}
                      {item.book.name.length > 30 && "...."}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {dateFormatter(item.createdAt)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-2 text-gray-900 ${
                        isReturnDateGone && "font-semibold bg-red-200"
                      }`}
                    >
                      {dateFormatter(item.returnDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        onClick={() => confirmHandler(item._id)}
                        className="inline-block rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {!loading && filteredAllotments.length === 0 && (
        <p className="text-center mt-10 text-gray-700">
          No Allotments Available!
        </p>
      )}
    </DashboardWrapper>
  );
};

export default ReturnBook;
