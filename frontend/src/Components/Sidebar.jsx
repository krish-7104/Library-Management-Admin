import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiBook,
  FiBookOpen,
  FiTag,
  FiDollarSign,
  FiUsers,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const data = useSelector((state) => state.userSlice.data);
  const { pathname } = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      path: "/dashboard",
      icon: <FiHome />,
    },
    {
      id: "allotment",
      label: "Allotment",
      icon: <FiBook />,
      children: [
        {
          id: "issue-book",
          label: "Issue Book",
          path: "/dashboard/issue-book",
        },
        {
          id: "return-book",
          label: "Return Book",
          path: "/dashboard/return-book",
        },
        {
          id: "allotments",
          label: "View Allotments",
          path: "/dashboard/allotments",
        },
      ],
    },
    {
      id: "books",
      label: "Books",
      icon: <FiBookOpen />,
      children: [
        {
          id: "books",
          label: "Search Book",
          path: "/dashboard/books",
        },
        {
          id: "modify-book",
          label: "Add Books",
          path: "/dashboard/modify-book",
          adminOnly: true,
        },
      ],
    },
    {
      id: "category",
      label: "Category",
      path: "/dashboard/category",
      icon: <FiTag />,
      adminOnly: true,
    },
    {
      id: "fines",
      label: "Fine Records",
      path: "/dashboard/fines",
      icon: <FiDollarSign />,
    },
    {
      id: "students",
      label: "Students",
      path: "/dashboard/students",
      icon: <FiUsers />,
    },
    {
      id: "send-message",
      label: "Send Message",
      path: "/dashboard/send-message",
      icon: <FiMail />,
    },
    {
      id: "admin",
      label: "Admin",
      icon: <FiUser />,
      children: [
        {
          id: "admins",
          label: "View Admins",
          path: "/dashboard/admins",
        },
        {
          id: "add-admin",
          label: "Add Admin",
          path: "/dashboard/add-admin",
          adminOnly: true,
        },
      ],
    },
  ];

  useEffect(() => {
    const pathParts = pathname.split("/");
    const route = pathParts[pathParts.length - 1];
    setActive(route === "dashboard" ? "home" : route);
  }, [pathname]);

  const renderNavItem = (item) => {
    if (item.adminOnly && data.role !== "Super") return null;

    if (item.children) {
      return (
        <li key={item.id} className="mb-2">
          <details
            className="group [&_summary::-webkit-details-marker]:hidden"
            open={item.children.some(
              (child) => active === child.id.replace("/", "")
            )}
          >
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 hover:bg-violet-100 transition-colors duration-200">
              <span className="font-medium flex items-center">
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
              </span>
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <MdKeyboardArrowDown className="h-5 w-5" />
              </span>
            </summary>
            <ul className="mt-2 space-y-2 px-4">
              {item.children.map((child) => {
                if (child.adminOnly && data.role !== "Super") return null;
                return (
                  <Link
                    key={child.id}
                    to={child.path}
                    onClick={() => setActive(child.id)}
                  >
                    <span
                      className={`block rounded-lg px-4 py-2.5 font-medium ${
                        active === child.id
                          ? "bg-violet-600 text-white"
                          : "hover:bg-violet-100"
                      } text-sm transition-colors duration-200`}
                    >
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={item.id} className="mb-2">
        <Link to={item.path} onClick={() => setActive(item.id)}>
          <span
            className={`block rounded-lg px-4 py-3 font-medium flex items-center ${
              active === item.id
                ? "bg-violet-600 text-white"
                : "hover:bg-violet-100"
            } transition-colors duration-200`}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            {item.label}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="flex w-[20%] flex-grow flex-col justify-between border-e bg-white">
      <div className="px-4 py-6 select-none">
        <ul className="space-y-2">
          {navItems.map((item) => renderNavItem(item))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
