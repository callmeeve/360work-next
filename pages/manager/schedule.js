import React, { useEffect, useState } from "react";
import api from "@/components/data/utils/api";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { HiOutlineTrash, HiPencilSquare } from "react-icons/hi2";
import { IoFilter } from "react-icons/io5";
import AddScheduleForm from "@/components/partials/manager/AddScheduleForm";

const ManagerSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/schedule/all");
      const data = res.data.schedules;
      setSchedules(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/manager/schedule/create", {
        employeeName,
        date,
        time,
      });
      const data = res.data;
      setSchedules([...schedules, data]);
      setEmployeeName("");
      setDate("");
      setTime("");

      alert("Schedule created successfully");

      window.location.reload();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handlePrevious = () => {
    // Logic for handling previous page
  };

  const handleNext = () => {
    // Logic for handling next page
  };

  const pageNumbers = [1, 2, 3, 4, 5]; // Example page numbers
  const [currentPage, setCurrentPage] = useState(1);

  const displayedSchedules = schedules.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow my-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center p-2">
              <h1 className="text-2xl font-semibold text-gray-800">Schedule</h1>
              <div className="flex items-center gap-x-2 ml-auto">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-green-500 text-green-500 hover:text-white hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Schedule
                </button>
                <AddScheduleForm isOpen={isOpen} onClose={closeModal} />

                <button
                  type="button"
                  className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <IoFilter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            <div className="-m-2 overflow-x-auto">
              <div className="p-4 min-w-full inline-block align-middle">
                <div className="border overflow-hidden">
                  {loading && (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm font-medium text-gray-500">
                        Loading...
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm font-medium text-red-500">
                        {error.message}
                      </p>
                    </div>
                  )}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Day
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Start Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          End Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedSchedules.map((schedule, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {schedule.day}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {schedule.startTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {schedule.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              className="mr-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <HiPencilSquare className="w-5 h-5" />
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:text-red-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:-scale-x-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span>previous</span>
                  </button>
                  <div className="items-center hidden lg:flex gap-x-3">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-2 py-1 text-sm rounded-md ${
                          number === currentPage
                            ? "text-blue-500 bg-blue-100/60"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100"
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:-scale-x-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerSchedulePage);
