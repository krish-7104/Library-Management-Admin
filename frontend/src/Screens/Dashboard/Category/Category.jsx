import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import { Plus, Trash, Pencil, Tag, BookOpen, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    getCategoryHandler();
  }, []);

  const getCategoryHandler = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${baseApi}/category/get-category`);
      setCategory(resp.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Adding Category...");
    try {
      const resp = await axios.post(
        `${baseApi}/category/add-category`,
        formData
      );
      toast.dismiss();
      setShowAddModal(false);
      setFormData({ name: "" });
      getCategoryHandler();
      toast.success(resp.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Updating Category...");
    try {
      const resp = await axios.patch(
        `${baseApi}/category/update-category/${selectedCategory._id}`,
        formData
      );
      toast.dismiss();
      setShowEditModal(false);
      setFormData({ name: "" });
      getCategoryHandler();
      toast.success(resp.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const confirmHandler = (id) => {
    Swal.fire({
      title: "Delete Category",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategoryHandler(id);
      }
    });
  };

  const deleteCategoryHandler = async (id) => {
    setLoading(true);
    toast.loading("Deleting Category...");
    try {
      const resp = await axios.delete(
        `${baseApi}/category/delete-category/${id}`
      );
      toast.dismiss();
      getCategoryHandler();
      toast.success(resp.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <DashboardWrapper title="Categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Tag size={24} />
            Book Categories
          </h2>
          <button
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading categories...
            </div>
          ) : category.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories found
            </div>
          ) : (
            category.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <BookOpen size={16} />
                      <span>{item.books.length} Books</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.books.length === 0 && (
                      <button
                        onClick={() => confirmHandler(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Category"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCategory(item);
                        setFormData({ name: item.name });
                        setShowEditModal(true);
                      }}
                      className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg"
                      title="Edit Category"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
              <form onSubmit={addCategoryHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: "" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                  >
                    {loading ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
              <form onSubmit={updateCategoryHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setFormData({ name: "" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                  >
                    {loading ? "Updating..." : "Update Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default Category;
