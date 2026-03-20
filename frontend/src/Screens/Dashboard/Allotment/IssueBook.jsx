import React, { useState } from "react";
import axios from "axios";
import { baseApi } from "../../../utils/baseApi.js";
import toast from "react-hot-toast";
import DashboardWrapper from "../../../Components/Dashboard/DashboardWrapper.jsx";
import Swal from "sweetalert2";
import moment from "moment";
import { Scanner } from "@yudiel/react-qr-scanner";
import { LuQrCode } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";

const IssueBook = () => {
  const [step, setStep] = useState(1);
  const [searchBook, setSearchBook] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState();
  const [issueData, setIssueData] = useState({
    user: "",
    book: "",
  });
  const [loading, setLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const searchBookHandler = async (e) => {
    setBooks([]);
    setSearchBook(e.target.value);
    let timer;
    const performSearch = async (value) => {
      if (value !== "") {
        try {
          const resp = await axios.get(
            `${baseApi}/book/get-books?search=${value}&stock=true`,
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

  const searchUserHandler = async (value) => {
    setSearchUser(value);
    if (value.length > 3 || Number.isInteger(Number(value))) {
      try {
        const resp = await axios.get(`${baseApi}/user/search?eno=${value}`);
        setUser(resp.data.data);
        setShowQrScanner(false);
      } catch (error) {
        toast.error("Student not found");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const confirmStudent = () => {
    if (user) {
      setIssueData({ ...issueData, user: user._id });
      setStep(2);
    }
  };

  const returnDateCalculator = () => {
    const date = moment();
    const returnDate = date.add(15, "days").format("dddd");
    const otherFormatDate = date.add(15, "days").format("DD/MM/YYYY");
    return `${returnDate} (${otherFormatDate})`;
  };

  const clearHandler = () => {
    setBooks([]);
    setSearchBook("");
    setUser();
    setSearchUser("");
    setIssueData({ user: "", book: "" });
    setStep(1);
  };

  const issueBookHandler = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(
        `${baseApi}/book-allotment/issue-book`,
        issueData,
      );
      toast.dismiss();
      Swal.fire({
        title: resp.data.message,
        icon: "success",
      });
      clearHandler();
    } catch (error) {
      toast.dismiss();
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
    setLoading(false);
  };

  const renderProgressSteps = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= s ? "bg-violet-600 text-white" : "bg-gray-200"
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`w-16 h-1 ${
                step > s ? "bg-violet-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handleQrScanner = async (result) => {
    const eno = JSON.parse(result[0].rawValue).enrollmentno;
    await searchUserHandler(eno);
  };

  return (
    <DashboardWrapper title={"Issue Book"}>
      {renderProgressSteps()}

      <div className="max-w-4xl mx-auto">
        {/* Step 1: Search Student */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold mb-6">
                {showQrScanner
                  ? "Scan QR Code to Search Student"
                  : "Search Student"}
              </h2>
              {showQrScanner ? (
                <button
                  className="group text-sm block relative items-center overflow-hidden rounded bg-violet-600 ring-violet-400 p-2 text-white focus:outline-none focus:ring active:bg-violet-500"
                  onClick={() => setShowQrScanner(!showQrScanner)}
                >
                  <IoCloseSharp size={28} />
                </button>
              ) : (
                <button onClick={() => setShowQrScanner(!showQrScanner)}>
                  <LuQrCode size={30} />
                </button>
              )}
            </div>
            {!showQrScanner && (
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Enter Student Enrollment Number"
                value={searchUser}
                onChange={(e) => searchUserHandler(e.target.value)}
              />
            )}
            {showQrScanner && (
              <div className="flex justify-center items-cente mt-10">
                <div className="w-[45%] h-auto">
                  <Scanner
                    onScan={handleQrScanner}
                    onError={(error) => console.log(error?.message)}
                  />
                </div>
              </div>
            )}
            {user && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-gray-600">
                        Enrollment: {user.enrollmentno}
                      </p>
                    </div>
                    {user.fine > 0 && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Fine: ₹{user.fine}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{user.phonenumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">{user.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Book Slots</p>
                      <p className="font-medium">{user.bookSlot}</p>
                    </div>
                  </div>

                  {user.fine > 0 || user.bookSlot === 0 ? (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600 font-medium">
                        {user.fine > 0
                          ? "Student has pending fine. Cannot issue book."
                          : "Student has no available book slots."}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={clearHandler}
                      >
                        Clear
                      </button>
                      <button
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                        onClick={confirmStudent}
                      >
                        Confirm & Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Book */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Book</h2>
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Search for a book..."
                value={searchBook}
                onChange={searchBookHandler}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{book.name}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <button
                      className="mt-2 w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition-colors"
                      onClick={() => {
                        setIssueData({ ...issueData, book: book._id });
                        setBooks(book);
                        setStep(3);
                      }}
                    >
                      Select Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirm Issue */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Book Issue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Student Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-600">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="text-gray-600">Enrollment:</span>{" "}
                    {user.enrollmentno}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    {user.phonenumber}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Book Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-600">Title:</span> {books.name}
                  </p>
                  <p>
                    <span className="text-gray-600">Author:</span>{" "}
                    {books.author}
                  </p>
                  <p>
                    <span className="text-gray-600">Return Date:</span>{" "}
                    {returnDateCalculator()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                onClick={issueBookHandler}
                disabled={loading}
              >
                {loading ? "Issuing..." : "Confirm Issue"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default IssueBook;
