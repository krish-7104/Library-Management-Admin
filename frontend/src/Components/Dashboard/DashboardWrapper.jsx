import React from "react";

const DashboardWrapper = ({ children, title }) => {
  return (
    <main className="p-6 bg-gray-100 min-h-[100vh]">
      {/* <p className="font-semibold text-2xl mb-6 pb-2 border-b-2 border-violet-600">
        {title}
      </p> */}
      {children}
    </main>
  );
};

export default DashboardWrapper;
