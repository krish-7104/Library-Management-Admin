import React, { useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import Swal from "sweetalert2";

const IssueBook = () => {
  const [searchBook, setSearchBook] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState();
  const [issueData, setIssueData] = useState({
    user: "",
    book: "",
  });
  const searchBookHandler = async (e) => {
    setBooks([]);
    setSearchBook(e.target.value);
    let timer;
    const performSearch = async (value) => {
      if (value !== "") {
        try {
          const resp = await axios.get(
            `${baseApi}/book/get-books?search=${value}`
          );
          toast.dismiss();
          setBooks(resp.data.data);
        } catch (error) {
          toast.dismiss();
          toast.error(error.response.data.message);
        }
      }
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  };

  const searchUserHandler = async (e) => {
    setSearchUser(e.target.value);
    let timer;
    const performSearch = async (value) => {
      if (value.length > 6) {
        try {
          const resp = await axios.get(`${baseApi}/user/search?eno=${value}`);
          setUser(resp.data.data);
          setIssueData({ ...issueData, user: resp.data.data._id });
        } catch (error) {}
      }
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  };

  const returnDateCalculator = () => {
    const date = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const returnDate =
      new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).getUTCDate() +
      "/" +
      (new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).getUTCMonth() + 1) +
      "/" +
      new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).getUTCFullYear() +
      " (" +
      dayNames[new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).getDay()] +
      ")";
    return returnDate;
  };

  const clearHandler = () => {
    setBooks([]);
    setSearchBook("");
    setUser();
    setSearchUser("");
    setIssueData({ user: "", book: "" });
  };

  const issueBookHandler = async () => {
    toast.loading("Issuing Book...");
    try {
      const resp = await axios.post(
        `${baseApi}/book-allotment/issue-book`,
        issueData
      );
      toast.dismiss();
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      });
    } catch (error) {
      toast.dismiss();
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
        confirmButtonColor: "#7c3aed",
        buttonsStyling: {},
      });
    }
    clearHandler();
  };

  return (
    <DashboardWrapper title={"Issue Book"}>
      <div className="w-full flex justify-evenly items-center gap-6">
        <label
          htmlFor="Student Enrollment No"
          className="relative w-1/2 rounded-lg border-gray-500 border outline-none p-3 text-sm bg-gray-100 block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
        >
          <input
            type="number"
            id="Student Enrollment No"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Student Enrollment No"
            value={searchUser}
            onChange={searchUserHandler}
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-gray-100 p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Student Enrollment No
          </span>
        </label>
        <label
          htmlFor="Search Book Name"
          className="relative w-1/2 rounded-lg border-gray-500 border outline-none p-3 text-sm bg-gray-100 block shadow-sm focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600"
        >
          <input
            type="text"
            id="Search Book Name"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Search Book Name"
            value={searchBook}
            onChange={searchBookHandler}
          />
          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-gray-100 p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Search Book Name
          </span>
        </label>
      </div>
      {searchBook && books && (
        <section className="grid grid-cols-5 grid-rows-1 w-full gap-4 mt-7 overflow-x-auto">
          {books.map((book) => {
            return (
              <div
                className="overflow-hidden rounded-lg group shadow transition cursor-pointer bg-white"
                key={book._id}
              >
                <img
                  alt="Office"
                  src={book.image}
                  className="h-56 w-full object-contain"
                />
                <div className="bg-white p-3">
                  <button
                    className="mt-2 w-full bg-violet-600 text-xs text-white p-2 rounded"
                    onClick={() => {
                      setIssueData({ ...issueData, book: book._id });
                      setBooks(book);
                      setSearchBook("");
                      setSearchUser("");
                    }}
                  >
                    Select Book
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}
      {user && (
        <section className="bg-white shadow-md p-4 mt-6 rounded ">
          <div className="flex justify-evenly">
            <div className="w-1/2">
              {(user?.fine > 0 || user?.bookSlot === 0) && (
                <span className="bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Not Allowed
                </span>
              )}
              <p className="mt-2">
                <span className="font-semibold">Name: </span>
                {user?.name}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Enrollment No: </span>
                {user?.enrollmentno}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Phone Number: </span>
                {user?.phonenumber}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Gender: </span>
                {user?.gender}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Fine: </span>
                {user?.fine}
              </p>
              {Object.keys(books).length !== 0 && (
                <>
                  <p className="mt-2">
                    <span className="font-semibold">Book Name: </span>
                    {books.name}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Book Author: </span>
                    {books.author}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Return Date: </span>
                    {returnDateCalculator()}
                  </p>
                </>
              )}
              <div className="flex">
                {!(user?.fine > 0 || user?.bookSlot === 0) && (
                  <button
                    className="rounded bg-violet-600 font-semibold px-8 py-2 block mt-4 text-white ring-violet-400 focus:outline-none focus:ring active:bg-violet-500 mr-4 disabled:bg-violet-400"
                    onClick={issueBookHandler}
                    disabled={!issueData.book}
                  >
                    Issue Now
                  </button>
                )}
                <button
                  className="rounded order-1 border-red-500 hover:bg-red-100 border-2 font-semibold px-8 py-2 block mt-4 text-red-500 focus:outline-none focus:ring"
                  onClick={clearHandler}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="w-1/2 flex justify-center items-center">
              {Object.keys(books).length !== 0 && (
                <img src={books.image} className="h-[300px]" alt="" />
              )}
            </div>
          </div>
        </section>
      )}
    </DashboardWrapper>
  );
};

export default IssueBook;
