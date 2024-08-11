import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import { Pencil, Plus, Trash } from "lucide-react";
import Swal from "sweetalert2";

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

  const addCategoryPopup = () => {
    Swal.fire({
      title: "Enter Category Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Add Category",
      showLoaderOnConfirm: true,
      preConfirm: async (name) => {
        if (name) {
          const token = localStorage.getItem("token");
          try {
            const resp = await axios.post(
              `${baseApi}/category/add-category`,
              {
                name,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return resp.data;
          } catch (error) {
            Swal.showValidationMessage(`
                ${error.response.data.message}
              `);
          }
        } else {
          Swal.showValidationMessage(`
            Enter Name Please
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: result.value.message,
          icon: "success",
        });
        getCategoryHandler();
      }
    });
  };

  const confirmHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Delete Category",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFineHandler(id);
      }
    });
  };

  const deleteFineHandler = async (id) => {
    try {
      const resp = await axios.delete(
        `${baseApi}/category/delete-category/${id}`
      );
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      });
      getCategoryHandler();
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  const updateCategoryPopup = (id, value) => {
    Swal.fire({
      title: "Update Category Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      inputValue: value,
      showCancelButton: true,
      confirmButtonText: "Update Category",
      showLoaderOnConfirm: true,
      preConfirm: async (name) => {
        if (name) {
          const token = localStorage.getItem("token");
          try {
            const resp = await axios.patch(
              `${baseApi}/category/update-category/${id}`,
              {
                name,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return resp.data;
          } catch (error) {
            Swal.showValidationMessage(`
            ${error.response.data.message}
          `);
          }
        } else {
          Swal.showValidationMessage(`
            Enter Name Please
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: result.value.message,
          icon: "success",
        });
        getCategoryHandler();
      }
    });
  };

  return (
    <DashboardWrapper title="Category">
      <div>
        <button
          className="absolute bottom-10 right-10 bg-violet-600 text-white p-3 rounded-md hover:bg-violet-700 cursor-pointer flex justify-between items-center"
          onClick={addCategoryPopup}
        >
          Add New Category <Plus size={23} className="ml-2" />
        </button>

        <section className="grid grid-cols-4 gap-4">
          {!loading &&
            category &&
            category.map((item) => {
              return (
                <div className="bg-white shadow p-3 rounded">
                  <p className="leading-3 text-xs text-gray-900">
                    Category Name:
                  </p>
                  <p className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-gray-900 mb-1">
                    Books: {item.books.length}
                  </p>
                  <div className="flex justify-end items-center">
                    {item.books.length === 0 && (
                      <button
                        onClick={() => confirmHandler(item?._id)}
                        className="inline-block rounded bg-red-500 p-2 font-medium text-white hover:bg-red-600 mr-2"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => updateCategoryPopup(item?._id, item?.name)}
                      className="inline-block rounded bg-violet-500 p-2 font-medium text-white hover:bg-violet-600"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
      {category && category.length === 0 && (
        <p className="text-center mt-10 text-gray-700">No Books Available!</p>
      )}
    </DashboardWrapper>
  );
};

export default Category;
