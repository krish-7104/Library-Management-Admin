import React, { useState } from "react";
import DashboardWrapper from "../../Components/Dashboard/DashboardWrapper";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseApi } from "../../utils/baseApi.js";
import toast from "react-hot-toast";

const SendMessage = () => {
  const router = useLocation();
  const [data, setData] = useState({
    email: router?.state?.email,
    subject: "",
    message: "",
    name: router?.state?.name,
  });

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${baseApi}/communication/send-message`,
        data
      );
      toast.dismiss();
      toast.success(resp.data.message);
      setData({
        email: "",
        subject: "",
        message: "",
        name: "",
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };
  return (
    <DashboardWrapper title={`Send Message To ${router?.state?.name}`}>
      <form
        onSubmit={sendMessageHandler}
        className="w-[55%] bg-white rounded-lg shadow py-8 px-6 mx-auto"
      >
        <h1 className="text-xl font-semibold text-center mt-2 mb-10">
          Send Message {router?.state && "To " + router?.state?.name}
        </h1>
        {!router?.state?.name && (
          <label
            htmlFor="name"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
          >
            <span className="absolute top-0 left-2.5 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all">
              Name
            </span>
            <input
              type="text"
              id="name"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none text-sm focus:ring-0 w-full"
              placeholder="Subject"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </label>
        )}
        <label
          htmlFor="email-address"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
        >
          <span className="absolute top-0 left-2.5 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all">
            Email Address
          </span>
          <input
            type="email"
            id="email-address"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none text-sm focus:ring-0 w-full disabled:text-gray-600"
            placeholder="Email Address"
            disabled={router?.state?.email}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </label>
        <label
          htmlFor="subject"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
        >
          <span className="absolute top-0 left-2.5 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all">
            Subject
          </span>
          <input
            type="text"
            id="subject"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none text-sm focus:ring-0 w-full"
            placeholder="Subject"
            value={data.subject}
            onChange={(e) => setData({ ...data, subject: e.target.value })}
          />
        </label>

        <label
          htmlFor="message"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600 p-3 mb-5"
        >
          <span className="absolute top-0 left-2.5 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all">
            Message
          </span>
          <textarea
            id="message"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none text-sm focus:ring-0 w-full"
            rows="4"
            placeholder="Enter Message Here"
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
          ></textarea>
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
            Send Message
          </span>
        </button>
      </form>
    </DashboardWrapper>
  );
};

export default SendMessage;
