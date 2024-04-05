import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import BookCard from "../../../Components/Dashboard/BookCard.jsx";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  const changeCategoryHandler = async (e) => {
    if (e.target.value !== "") {
      try {
        const resp = await axios.get(
          `${baseApi}/category/get-category?book=true&search=${e.target.value}`
        );
        setBooks(resp.data.data[0].books);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
          setLoading(false);
        } catch (error) {
          setLoading(false);
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

  return (
    <DashboardWrapper title="Search Books">
      <section className="flex justify-between items-center mt-2 mb-6">
        <div className="relative w-[35%] border-2 rounded-md">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="Search"
            placeholder="Search Books..."
            value={search}
            onChange={searchHandler}
            className="w-full rounded-md border-gray-200 placeholder:text-gray-700 outline-none py-2.5 pe-10 px-2 shadow-sm sm:text-sm"
          />
        </div>
        <div className="w-[30%] rounded-md border-2">
          <select
            className="w-full rounded-lg py-2.5 px-2 border-gray-300 text-gray-700 sm:text-sm"
            onChange={changeCategoryHandler}
          >
            <option value="">Select Category</option>
            {category &&
              category.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
          </select>
        </div>
      </section>
      <section className="grid-cols-5 grid w-full gap-4">
        {!loading &&
          books &&
          books.map((book) => {
            return <BookCard key={book._id} book={book} />;
          })}
        {books && books.length === 0 && <p>No Books Available!</p>}
      </section>
    </DashboardWrapper>
  );
};

export default Book;
