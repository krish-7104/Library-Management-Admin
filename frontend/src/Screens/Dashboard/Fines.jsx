import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApi } from "../../utils/baseApi";
import { Trash, Plus, ArrowLeft } from "lucide-react";
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
        setData({
          eno: undefined,
          amount: undefined,
          user: "",
        });
        setShowAdd(false);
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
      if (value.length > 3) {
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
    <main className="p-6 bg-gray-50 min-h-[100vh]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fine Records</h1>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showAdd
                ? "bg-white border-2 border-violet-600 text-violet-600 hover:bg-violet-50"
                : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? (
              <>
                <ArrowLeft size={18} />
                Back to List
              </>
            ) : (
              <>
                <Plus size={18} />
                Add New Record
              </>
            )}
          </button>
        </div>

        {showAdd ? (
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Add New Fine Record
            </h2>
            <form onSubmit={addFineHandler} className="space-y-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium mb-2 block">
                    Enrollment Number
                  </span>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Enter enrollment number"
                    value={data.eno}
                    onChange={searchUserHandler}
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 text-sm font-medium mb-2 block">
                    Fine Amount
                  </span>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                    placeholder="Enter fine amount"
                    value={data.amount}
                    onChange={(e) =>
                      setData({ ...data, amount: e.target.value })
                    }
                  />
                </label>
              </div>

              <button
                className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:bg-violet-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={!data.amount}
              >
                Add Fine Record
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Enrollment No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Paid On
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!loading &&
                    fines &&
                    fines.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item?.user?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item?.user?.enrollmentno}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item?.user?.phonenumber}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{item?.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {dateFormatter(item?.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => confirmHandler(item?._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {fines && fines?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No fine records found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Fines;
