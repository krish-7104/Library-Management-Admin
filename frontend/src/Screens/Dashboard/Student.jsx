import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApi } from "../../utils/baseApi";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getStudentHandler();
  }, []);

  const getStudentHandler = async () => {
    setLoading(true);
    toast.loading("Loading Students..");
    try {
      const resp = await axios.get(`${baseApi}/user/allusers`);
      setStudents(resp.data.data);
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const filteredStudents = students.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-[90vh] bg-gray-100 flex justify-center pt-2">
      <div className="w-[90%] flex justify-start items-center flex-col">
        <div className="mb-4 my-2 flex justify-end items-center w-full">
          <input
            type="text"
            className="w-[30%] px-2 py-[6px] rounded border-2 outline-none text-sm"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Student Name"
            value={search}
          />
        </div>
        <table className="w-full divide-y-2 divide-gray-200 max-h-[100vh] bg-white text-sm rounded shadow overflow-y-auto mb-4">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Enrollment No
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Phone No.
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Email
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Fine
              </th>
              <th className="whitespace-nowrap p-3 font-medium text-gray-900">
                Slot Available
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 overflow-scroll">
            {!loading &&
              filteredStudents &&
              filteredStudents.map((item) => {
                return (
                  <tr className="text-center">
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.enrollmentno}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.phonenumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.fine}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {item.bookSlot}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        onClick={() =>
                          navigate("/dashboard/send-message", {
                            state: {
                              email: item.email,
                              eno: item.enrollmentno,
                              name: item.name,
                            },
                          })
                        }
                        className="inline-block rounded bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700"
                      >
                        <Send size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {filteredStudents && filteredStudents?.length === 0 && (
          <p className="text-center mt-10 text-gray-700">No Students Found!</p>
        )}
      </div>
    </main>
  );
};

export default Student;
