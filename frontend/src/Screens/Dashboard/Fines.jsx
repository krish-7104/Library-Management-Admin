import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApi } from "../../utils/baseApi";
import { Trash } from "lucide-react";
import { dateFormatter } from "../../utils/DateFormatter.js";
import Swal from "sweetalert2";

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [data, setData] = useState({
    eno: undefined,
    amount: undefined,
    user: "",
  });

  useEffect(() => {
    getFineHandler();
  }, []);

  const getFineHandler = async () => {
    setLoading(true);
    toast.loading("Loading Fines Record..");
    try {
      const resp = await axios.get(`${baseApi}/fines`);
      setFines(resp.data.data);
      setLoading(false);
      console.log(resp.data.data);
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
      confirmButtonText: "Yes Delete Record",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFineHandler(id);
      }
    });
  };

  const deleteFineHandler = async (id) => {
    try {
      const resp = await axios.delete(`${baseApi}/fines/delete-record/${id}`);
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      });
      getFineHandler();
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  const addFineHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${baseApi}/fines/add-record`, {
        user: data.user,
        amount: data.amount,
      });
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      }).then(() => {
        getFineHandler();
      });
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  const searchUserHandler = async (e) => {
    let timer;
    const performSearch = async (value) => {
      if (value.length > 6) {
        try {
          const resp = await axios.get(`${baseApi}/user/search?eno=${value}`);
          setData({
            user: resp.data.data._id,
            amount: resp.data.data.fine,
          });
        } catch (error) {}
      }
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  };

  return (
    <main className="p-6 bg-gray-100 min-h-[100vh]">
      <button
        className={`absolute bottom-10 right-10 ${
          showAdd
            ? "border-2 border-violet-600 text-violet-600"
            : "bg-violet-600 hover:bg-violet-700 text-white"
        }  p-3 rounded-md  cursor-pointer flex justify-between items-center`}
        onClick={() => setShowAdd(!showAdd)}
      >
        {showAdd ? `Back To List` : `Add New Record `}
      </button>
      {showAdd && (
        <form
          onSubmit={addFineHandler}
          className="w-[55%] bg-white rounded-lg shadow py-8 px-6 mx-auto"
        >
          <h1 className="text-2xl font-semibold text-center mt-2 mb-6">
            Add New Fine Record
          </h1>
          <label
            htmlFor="Enrollment No"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
          >
            <input
              type="number"
              id="Enrollment No"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
              placeholder="Enrollment No"
              value={data.eno}
              onChange={searchUserHandler}
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Enrollment No
            </span>
          </label>
          <label
            htmlFor="amount"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
          >
            <input
              type="number"
              id="amount"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
              placeholder="amount"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Amount
            </span>
          </label>
          <button
            className="group block mx-auto relative items-center overflow-hidden rounded bg-violet-600 ring-violet-400 px-8 py-3 text-white focus:outline-none focus:ring active:bg-violet-500 disabled:bg-violet-400"
            type="submit"
            disabled={!data.amount}
          >
            Add Record
          </button>
        </form>
      )}
      {!showAdd && (
        <div className="">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Enrollment No
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Phone Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Amount
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Paid On
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading &&
                fines &&
                fines.map((item) => {
                  return (
                    <tr className="text-center">
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        {item?.user?.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        {item?.user?.enrollmentno}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        {item?.user?.phonenumber}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        ₹{item?.amount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        {dateFormatter(item?.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <button
                          onClick={() => confirmHandler(item?._id)}
                          className="inline-block rounded bg-red-500 p-2 font-medium text-white hover:bg-red-600"
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {fines && fines?.length === 0 && (
            <p className="text-center mt-10 text-gray-700">
              No Fines Records Found!
            </p>
          )}
        </div>
      )}
    </main>
  );
};

export default Fines;
