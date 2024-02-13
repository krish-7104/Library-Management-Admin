import React from "react";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-white p-4 border-b shadow flex justify-between items-center">
      <p className="font-semibold text-xl">Library Management System</p>
      <button
        className="inline-flex items-center rounded px-4 gap-x-2 py-2 text-violet-600 hover:bg-violet-200 hover:text-violet-600 focus:outline-none focus:ring active:bg-violet-200 cursor-pointer"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        <span className="text-sm font-medium"> Logout </span>
        <IoMdLogOut size={20} />
      </button>
    </nav>
  );
};

export default Navbar;
