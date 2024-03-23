import React from "react";
import { PiBooksLight, PiStudent } from "react-icons/pi";
import { LuIndianRupee } from "react-icons/lu";
import { GoIssueClosed } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";

const DashCard = ({ title, number }) => {
  const getIconHandler = () => {
    if (title === "Books" || title === "Allotments") {
      return (
        <div className="text-violet-600 border-r text-4xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <PiBooksLight />
        </div>
      );
    } else if (title === "Students") {
      return (
        <div className="text-violet-600 border-r text-4xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <PiStudent />
        </div>
      );
    } else if (title === "Issued") {
      return (
        <div className="text-violet-600 border-r text-3xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <GoIssueClosed />
        </div>
      );
    } else if (title === "Fines") {
      return (
        <div className="text-violet-600 border-r text-3xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <LuIndianRupee />
        </div>
      );
    } else if (title === "Admins") {
      return (
        <div className="text-violet-600 border-r text-3xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <RiAdminLine />
        </div>
      );
    } else if (title === "Book Category") {
      return (
        <div className="text-violet-600 border-r text-3xl p-2 rounded-l-md h-[80px] w-[80px] flex justify-center items-center">
          <MdOutlineCategory />
        </div>
      );
    }
  };
  return (
    <div className="bg-white border w-full rounded-md shadow flex justify-between items-center">
      {getIconHandler()}
      <div className="flex justify-center items-end flex-col mr-5">
        <span className="text-sm font-medium text-slate-700 mb-1 text-right mr-auto">
          {title}
        </span>
        <p className="text-4xl font-medium">{number}</p>
      </div>
    </div>
  );
};

export default DashCard;
