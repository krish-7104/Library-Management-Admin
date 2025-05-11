import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../utils/baseApi";
import toast from "react-hot-toast";
import { Upload, X, BookOpen, Pencil } from "lucide-react";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper";
import { useParams, useNavigate } from "react-router-dom";

const ModifyBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: undefined,
    stock: undefined,
    category: "",
    author: "",
  });

  useEffect(() => {
    getCategoryHandler();
    if (isEditMode) {
      getBookHandler();
    }
  }, [isEditMode]);

  const getBookHandler = async () => {
    try {
      const resp = await axios.get(`${baseApi}/book/get-book/${id}`);
      const book = resp.data.data;
      setFormData({
        name: book.name,
        price: book.price,
        stock: book.stock,
        category: book.category._id,
        author: book.author,
      });
      setPreviewImage(book.image);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
    }
  };

  const getCategoryHandler = async () => {
    try {
      const resp = await axios.get(`${baseApi}/category/get-category`);
      setCategory(resp.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    if (!isEditMode && !image) {
      toast.error("Please upload a book image");
      return;
    }
    e.preventDefault();
    setLoading(true);
    toast.loading(isEditMode ? "Updating Book..." : "Adding Book...");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("author", formData.author);
    if (image) {
      data.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const url = isEditMode
        ? `${baseApi}/book/update-book/${id}`
        : `${baseApi}/book/add-book`;

      const resp = await axios[isEditMode ? "patch" : "post"](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss();
      toast.success(resp.data.message);

      if (!isEditMode) {
        setFormData({
          name: "",
          price: "",
          stock: "",
          category: "",
          author: "",
        });
        setImage("");
        setPreviewImage("");
      }

      navigate("/dashboard/books");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <DashboardWrapper title={isEditMode ? "Edit Book" : "Add Book"}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={24} className="text-violet-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit Book" : "Add New Book"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Book Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter book name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  value={formData.author}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  value={formData.price}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter book price"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  value={formData.stock}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="Enter stock quantity"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  value={formData.category}
                >
                  <option value="">Select Category</option>
                  {category.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Book Cover
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    hidden
                    required={!isEditMode}
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer text-center text-sm text-gray-600"
                  >
                    {isEditMode ? "Change Image" : "Choose Image"}
                  </label>
                  {(image || previewImage) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage();
                        setPreviewImage("");
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {previewImage && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview
                </p>
                <div className="relative w-32 h-40">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/books")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!isEditMode && !image)}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <Pencil size={18} />
                        Update Book
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Add Book
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default ModifyBook;
