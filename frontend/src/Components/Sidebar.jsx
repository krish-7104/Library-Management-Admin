import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActive("home");
    } else if (pathname === "/dashboard/books") {
      setActive("searchbook");
    } else if (pathname === "/dashboard/add-book") {
      setActive("addbook");
    } else if (pathname === "/dashboard/issue-book") {
      setActive("issuebook");
    } else if (pathname === "/dashboard/return-book") {
      setActive("returnbook");
    } else if (pathname === "/dashboard/allotments") {
      setActive("allotments");
    } else if (pathname === "/dashboard/fines") {
      setActive("fines");
    } else if (pathname === "/dashboard/students") {
      setActive("students");
    } else if (pathname === "/dashboard/myaccount") {
      setActive("myaccount");
    }
  }, [pathname]);
  return (
    <div className="flex w-[20%] flex-grow flex-col justify-between border-e bg-white">
      <div className="px-4 py-6 select-none">
        <ul className="space-y-1">
          <li>
            <Link to={"/dashboard"} onClick={() => setActive("home")}>
              <span
                className={`block rounded-lg ${
                  active === "home"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-100"
                } px-4 py-2 font-medium`}
              >
                Home
              </span>
            </Link>
          </li>
          <li>
            <details
              className="group [&_summary::-webkit-details-marker]:hidden"
              open={active === "searchbook" || active === "addbook"}
            >
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2  hover:bg-violet-100">
                <span className="font-medium"> Books </span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4">
                <Link
                  to={"/dashboard/books"}
                  onClick={() => setActive("searchbook")}
                >
                  <span
                    className={`block rounded-lg px-4 py-2 font-medium ${
                      active === "searchbook"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-violet-100"
                    } text-sm mb-1`}
                  >
                    Search Book
                  </span>
                </Link>

                <Link
                  to={"/dashboard/add-book"}
                  onClick={() => setActive("addbook")}
                >
                  <span
                    className={`block rounded-lg px-4 py-2 font-medium ${
                      active === "addbook"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-violet-100"
                    } text-sm mb-1`}
                  >
                    Add Books
                  </span>
                </Link>
              </ul>
            </details>
          </li>
          <li>
            <details
              className="group [&_summary::-webkit-details-marker]:hidden"
              open={
                active === "issuebook" ||
                active === "returnbook" ||
                active === "allotments"
              }
            >
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2  hover:bg-violet-100">
                <span className="font-medium"> Allotment </span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4">
                <Link
                  to={"/dashboard/issue-book"}
                  onClick={() => setActive("issuebook")}
                >
                  <span
                    className={`block rounded-lg px-4 py-2 font-medium ${
                      active === "issuebook"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-violet-100"
                    } text-sm mb-1`}
                  >
                    Issue Book
                  </span>
                </Link>
                <Link
                  to={"/dashboard/return-book"}
                  onClick={() => setActive("returnbook")}
                >
                  <span
                    className={`block rounded-lg px-4 py-2 font-medium ${
                      active === "returnbook"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-violet-100"
                    } text-sm mb-1`}
                  >
                    Return Book
                  </span>
                </Link>
                <Link
                  to={"/dashboard/allotments"}
                  onClick={() => setActive("allotments")}
                >
                  <span
                    className={`block rounded-lg px-4 py-2 font-medium ${
                      active === "allotments"
                        ? "bg-violet-600 text-white"
                        : "hover:bg-violet-100"
                    } text-sm mb-1`}
                  >
                    View Allotments
                  </span>
                </Link>
              </ul>
            </details>
          </li>
          <li>
            <Link to={"/dashboard/fines"} onClick={() => setActive("fines")}>
              <span
                className={`block rounded-lg ${
                  active === "fines"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-100"
                } px-4 py-2 font-medium`}
              >
                Fines
              </span>
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/students"}
              onClick={() => setActive("students")}
            >
              <span
                className={`block rounded-lg ${
                  active === "students"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-100"
                } px-4 py-2 font-medium`}
              >
                Students
              </span>
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard/myaccount"}
              onClick={() => setActive("myaccount")}
            >
              <span
                className={`block rounded-lg ${
                  active === "myaccount"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-100"
                } px-4 py-2 font-medium`}
              >
                My Account
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
