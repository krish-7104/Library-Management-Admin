import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApi } from "../../../utils/baseApi";
import { dateFormatter } from "../../../utils/DateFormatter";
import { useNavigate } from "react-router-dom";
import { Trash, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = useSelector((state) => state.userSlice.data);

  useEffect(() => {
    getAdminHandler();
  }, []);

  const getAdminHandler = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      toast.loading("Loading Admins..");
      try {
        const resp = await axios.get(`${baseApi}/admin/get-admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(resp.data.data);
        setLoading(false);
        toast.dismiss();
      } catch (error) {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Unauthorized User");
      navigate("/");
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
      confirmButtonText: "Yes Delete Admin",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAdminHandler(id);
      }
    });
  };

  const deleteAdminHandler = async (id) => {
    try {
      const resp = await axios.delete(`${baseApi}/admin/delete-admin/${id}`);
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      });
      getAdminHandler();
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-[100vh]">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th></th>
            <th className="whitespace-nowrap p-3 font-medium text-gray-900">
              Name
            </th>
            <th className="whitespace-nowrap p-3 font-medium text-gray-900">
              Email
            </th>
            <th className="whitespace-nowrap p-3 font-medium text-gray-900">
              Phone Number
            </th>
            <th className="whitespace-nowrap p-3 font-medium text-gray-900">
              Role
            </th>
            <th className="whitespace-nowrap p-3 font-medium text-gray-900">
              Created Date
            </th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!loading &&
            admins &&
            admins.map((item) => {
              return (
                <tr className="text-center" key={item._id}>
                  <td>
                    {data && data._id === item._id && (
                      <span className="bg-green-200 px-3 py-1 rounded-full text-xs ml-2">
                        You
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {item.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {item.phonenumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {item.role}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {dateFormatter(item.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit-admin/${item._id}`)
                      }
                      className="inline-block rounded bg-violet-500 p-2 font-medium text-white hover:bg-violet-600 mr-2"
                    >
                      <Pencil size={14} />
                    </button>{" "}
                    <button
                      onClick={() => confirmHandler(item._id)}
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
    </main>
  );
};

export default Admins;
