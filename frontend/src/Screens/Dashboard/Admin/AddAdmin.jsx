import React, { useState } from "react";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const AddAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    password: "",
    role: "",
  });
  const addAdminHandler = async (e) => {
    e.preventDefault();
    toast.loading("Adding Admin");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await axios.post(
          `${baseApi}/admin/auth/add-admin`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/dashboard/admins");
        toast.dismiss();
        toast.success(resp.data.message);
      } catch (error) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Unauthorized User");
      navigate("/");
    }
  };
  return (
    <DashboardWrapper title={"Add Book"}>
      <div className="flex justify-center items-center w-full">
        <form
          action=""
          className="space-y-4 w-[60%] bg-white p-10 shadow-md rounded-md"
          onSubmit={addAdminHandler}
        >
          <p className="text-center font-semibold text-xl">Add New Admin</p>
          <label
            htmlFor="Name"
            className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
          >
            <input
              type="text"
              id="Name"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Name
            </span>
          </label>
          <div>
            <label
              htmlFor="Email"
              className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
            >
              <input
                type="email"
                id="Email"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Email
              </span>
            </label>
          </div>
          <div>
            <label
              htmlFor="Password"
              className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
            >
              <input
                type="password"
                id="Password"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Password
              </span>
            </label>
          </div>
          <div>
            <label
              htmlFor="Phone Number"
              className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
            >
              <input
                type="number"
                id="Phone Number"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                placeholder="Phone Number"
                value={formData.phonenumber}
                onChange={(e) =>
                  setFormData({ ...formData, phonenumber: e.target.value })
                }
              />
              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Phone Number
              </span>
            </label>
          </div>
          <div>
            <select
              className="w-full rounded-lg py-3 px-1 sm:text-sm outline-none bg-white border-gray-500 border"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              value={formData.role}
            >
              <option value="">Select Role</option>
              <option value={"Normal"}>Normal</option>
              <option value={"Super"}>Super</option>
            </select>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="inline-block w-full rounded-lg bg-black px-5 mt-2 py-3 font-medium text-white sm:w-auto"
              onSubmit={addAdminHandler}
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </DashboardWrapper>
  );
};

export default AddAdmin;
