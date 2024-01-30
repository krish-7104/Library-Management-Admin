import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategoryHandler();
  }, []);

  const getCategoryHandler = async () => {
    setLoading(true);
    toast.loading("Loading Category..");
    try {
      const resp = await axios.get(`${baseApi}/category/get-category`);
      setCategory(resp.data.data);
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-[100vh]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded shadow">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Category Id
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Books
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading &&
              category &&
              category.map((item) => {
                return (
                  <tr className="text-center">
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item._id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.books.length}
                    </td>
                    {/* <td className="whitespace-nowrap px-4 py-2">
                      <button
                        href="/"
                        className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                      >
                        View
                      </button>
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {category && category.length === 0 && (
        <p className="text-center mt-10 text-gray-700">No Books Available!</p>
      )}
    </main>
  );
};

export default Category;
