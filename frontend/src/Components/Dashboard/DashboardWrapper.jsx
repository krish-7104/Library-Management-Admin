import React from "react";

const DashboardWrapper = ({ children, title }) => {
  return <main className="p-6 bg-gray-100 min-h-[100vh]">{children}</main>;
};

export default DashboardWrapper;
