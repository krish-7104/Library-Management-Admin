import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import BookCard from "../../../Components/Dashboard/BookCard.jsx";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper";
import { Plus, Search, BookOpen, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getBooksDataHandler();
    getCategoryHandler();
  }, []);

  const getBooksDataHandler = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${baseApi}/book/get-books`);
      setBooks(resp.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
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

  const changeCategoryHandler = async (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value !== "") {
      try {
        const resp = await axios.get(
          `${baseApi}/category/get-category?book=true&search=${value}`
        );
        setBooks(resp.data.data[0].books);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      getBooksDataHandler();
    }
  };

  const searchHandler = async (e) => {
    setSearch(e.target.value);
    let timer;
    const performSearch = async (value) => {
      if (value !== "") {
        try {
          const resp = await axios.get(
            `${baseApi}/book/get-books?search=${value}`
          );
          setBooks(resp.data.data);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      } else {
        getBooksDataHandler();
      }
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    getBooksDataHandler();
  };

  return (
    <DashboardWrapper title="Books">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen size={24} />
            Book Collection
          </h2>
          <button
            onClick={() => navigate("/dashboard/add-book")}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Book
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={search}
                  onChange={searchHandler}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-[250px]">
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <select
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent appearance-none"
                  value={selectedCategory}
                  onChange={changeCategoryHandler}
                >
                  <option value="">All Categories</option>
                  {category.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(search || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading books...
            </div>
          ) : books.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No books found
            </div>
          ) : (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={() =>
                  navigate("/dashboard/add-book", { state: { book } })
                }
              />
            ))
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Book;
