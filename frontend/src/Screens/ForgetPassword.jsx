import React, { useState } from "react";
import axios from "axios";
import { baseApi } from "../utils/baseApi.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
  });

  const sendResetLink = async (e) => {
    e.preventDefault();
    toast.loading("Processing Reset..");
    try {
      const resp = await axios.post(`${baseApi}/admin/forget-password`, data);
      toast.dismiss();
      toast.success(resp.data.message);
      navigate("/");
    } catch (error) {
      toast.dismiss();
      console.log("error");
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <section className="w-full bg-gray-100">
      <div className="max-w-6xl h-[100vh] mx-auto flex justify-center items-center">
        <form
          onSubmit={sendResetLink}
          className="w-[45%] bg-white rounded-lg shadow py-8 px-6"
        >
          <h1 className="text-2xl font-semibold text-center mt-2 mb-10">
            Forget Password
          </h1>
          <label
            htmlFor="Email Address"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
          >
            <input
              type="email"
              id="Email Address"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
              placeholder="Email Address"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Email Address
            </span>
          </label>

          <button
            className="group block mx-auto relative items-center overflow-hidden rounded bg-violet-600 ring-violet-400 px-8 py-3 text-white focus:outline-none focus:ring active:bg-violet-500"
            type="submit"
          >
            <span className="absolute -end-full transition-all group-hover:end-4">
              <svg
                className="h-5 w-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <span className="text-sm font-medium transition-all group-hover:me-4">
              Send Reset Link
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;
