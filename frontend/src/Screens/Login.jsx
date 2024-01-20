import React, { useState } from "react";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const checkLoginHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <section className="w-full bg-gray-100">
      <div class="max-w-6xl h-[100vh] mx-auto flex justify-center items-center">
        <form
          onSubmit={checkLoginHandler}
          className="w-[45%] bg-white rounded-lg shadow py-4 px-6"
        >
          <h1 className="text-2xl font-semibold text-center mt-4 mb-6">
            Library Management System
          </h1>
          <div className="flex justify-start flex-col mb-3">
            <label htmlFor="email" className="mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={data.email}
              className="px-3 py-3 rounded-md bg-gray-100 outline-none"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="flex justify-start flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={data.password}
              className="px-3 py-3 rounded-md bg-gray-100 outline-none"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button className="block mx-auto px-8 mt-6 mb-4 py-3 rounded-lg bg-gray-900 text-white outline-none">
            Login Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
