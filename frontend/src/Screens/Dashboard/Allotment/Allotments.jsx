import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import { dateFormatter } from "../../../utils/DateFormatter.js";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";

const Allotments = () => {
  const [allotment, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnFilter, setReturnFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getAllotmentHandler = async () => {
      setLoading(true);
      toast.loading("Loading Allotments...");
      try {
        let resp = "";
        if (returnFilter !== "all")
          resp = await axios.get(
            `${baseApi}/book-allotment/allotments?returned=${returnFilter}`
          );
        else resp = await axios.get(`${baseApi}/book-allotment/allotments`);
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
    returnFilter && getAllotmentHandler();
  }, [returnFilter]);

  const filteredAllotments = allotment.filter((item) =>
    item.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardWrapper title={"Book Allotments"}>
      <div className="">
        <section className="mb-4 flex justify-between items-center">
          <div className="flex">
            <p className="font-semibold mr-4">Filters</p>
            <span
              className={`${
                returnFilter === "all" && "bg-violet-400"
              } px-3 block text-center w-[70px] py-1 text-sm border mr-3 hover:bg-violet-400 rounded-full cursor-pointer`}
              onClick={() => setReturnFilter("all")}
            >
              All
            </span>
            <span
              className={`${
                returnFilter === "true" && "bg-violet-400"
              } px-3 block text-center w-[70px] py-1 text-sm border mr-3 hover:bg-violet-400 rounded-full cursor-pointer`}
              onClick={() => setReturnFilter("true")}
            >
              True
            </span>
            <span
              className={`${
                returnFilter === "false" && "bg-violet-400"
              } px-3 block text-center w-[70px] py-1 text-sm border mr-3 hover:bg-violet-400 rounded-full cursor-pointer`}
              onClick={() => setReturnFilter("false")}
            >
              False
            </span>
          </div>
          <input
            type="text"
            className="w-[30%] px-2 py-[6px] rounded border-2 outline-none text-sm"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Student Name"
            value={search}
          />
        </section>
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Student Name
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Book
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Returned
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Allotment Date
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Return Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              filteredAllotments &&
              filteredAllotments.map((item) => {
                return (
                  <tr className="text-center">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {item.user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.book.name?.slice(0, 30)}
                      {item.book.name.length > 30 && "...."}
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
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {filteredAllotments && filteredAllotments.length === 0 && (
        <p className="text-center mt-10 text-gray-700">No Allotments Found!</p>
      )}
    </DashboardWrapper>
  );
};

export default Allotments;
