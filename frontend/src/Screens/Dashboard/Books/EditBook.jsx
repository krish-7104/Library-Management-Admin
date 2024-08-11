import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../utils/baseApi";
import toast from "react-hot-toast";
import { LuUpload, LuX } from "react-icons/lu";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper";
import { useLocation, useNavigate } from "react-router-dom";
const EditBook = () => {
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: undefined,
    stock: undefined,
    category: "",
    author: "",
  });

  useEffect(() => {
    getCategoryHandler();
    getBookHandler();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const getCategoryHandler = async () => {
    try {
      const resp = await axios.get(`${baseApi}/category/get-category`);
      setCategory(resp.data.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const saveChangesHandler = async (e) => {
    e.preventDefault();
    toast.loading("Updating Book..");
    try {
      const resp = await axios.patch(
        `${baseApi}/book/update-book/${location.pathname.replace(
          "/dashboard/edit-book/",
          ""
        )}`,
        {
          name: formData.name,
          category: formData.category,
          stock: formData.stock,
          price: formData.price,
          author: formData.author,
        }
      );
      toast.dismiss();
      navigate("/dashboard/books");
      toast.success(resp.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const getBookHandler = async () => {
    try {
      const resp = await axios.get(
        `${baseApi}/book/get-book/${location.pathname.replace(
          "/dashboard/edit-book/",
          ""
        )}`
      );
      setFormData(resp.data.data);
      setPreviewImage(resp.data.data.image);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <DashboardWrapper title={"Add Book"}>
      <div className="flex justify-center items-center">
        <form
          action=""
          className="space-y-4 w-[60%] bg-white p-10 shadow-md rounded-md"
          onSubmit={saveChangesHandler}
        >
          <p className="text-center font-semibold text-xl">Edit Book</p>
          <label
            htmlFor="Book Name"
            className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
          >
            <input
              type="text"
              id="Book Name"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
              placeholder="Book Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Book Name
            </span>
          </label>
          <div>
            <label
              htmlFor="Book Author"
              className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
            >
              <input
                type="text"
                id="Book Author"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                placeholder="Book Author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Book Author
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="Book Price"
                className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
              >
                <input
                  type="number"
                  id="Book Price"
                  className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                  placeholder="Book Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Book Price
                </span>
              </label>
            </div>
            <div>
              <label
                htmlFor="Book Stock"
                className="relative w-full rounded-lg border-gray-500 border outline-none p-3 text-sm bg-white block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
              >
                <input
                  type="number"
                  id="Book Stock"
                  className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                  placeholder="Book Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Book Stock
                </span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select
              className="w-full rounded-lg py-3 px-1 sm:text-sm outline-none bg-white border-gray-500 border"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              <option value="">Select Category</option>
              {category &&
                category.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
            <input
              type="file"
              hidden
              id="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              className="rounded-lg bg-white px-5 py-3 font-medium border-gray-500 sm:w-auto w-full border text-sm flex justify-center items-center text-gray-700 cursor-pointer"
              htmlFor="file"
            >
              Replace Image
              <span className="ml-2">
                <LuUpload size={19} />
              </span>
            </label>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="inline-block w-full rounded-lg bg-black px-5 mt-2 py-3 font-medium text-white sm:w-auto"
              onSubmit={saveChangesHandler}
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="flex relative">
          <img src={previewImage} alt="" className="w-52 ml-10" />
          {image && (
            <div
              className="bg-violet-600 absolute right-5 -top-10 p-2 rounded-full cursor-pointer hover:bg-violet-800"
              onClick={() => {
                setImage();
                setPreviewImage("");
              }}
            >
              <LuX className="text-white" />
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default EditBook;
