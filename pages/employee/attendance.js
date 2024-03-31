import React, { useState, useEffect } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { HiOutlineCamera } from "react-icons/hi2";
import api from "@/components/data/utils/api";
import { toLocalIsoString } from "@/components/data/utils/function";

const EmployeeAttendancePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Add currentDate state
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSchedules = async () => {
    try {
      const response = await api.get("/api/employee/schedule/all");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedule", error);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("date", date);

      const response = await api.post(
        "/api/employee/attendance/create",
        formData
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting attendance", error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-5">
      <h1 className="text-3xl font-semibold mb-5">Attendance</h1>
      <div className="flex-grow mt-5">
        <div className="bg-white p-4 rounded border shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <div className="mt-1">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              {schedules.map((schedule) => {
                const start = new Date(schedule.startDate);
                const end = new Date(schedule.endDate);
                const dates = [];
                for (
                  let dt = new Date(start);
                  dt <= end;
                  dt.setDate(dt.getDate() + 1)
                ) {
                  dates.push(new Date(dt));
                }
                return dates.map((date, index) => {
                  const dateStr = toLocalIsoString(date);
                  const todayStr = toLocalIsoString(new Date());
                  const isToday = todayStr === dateStr;
                  const isFuture = todayStr < dateStr;
                  return (
                    <button
                      key={index}
                      value={dateStr}
                      onClick={handleDateChange}
                      disabled={isFuture}
                      className={`flex flex-col items-center justify-center m-2 p-4 bg-white border rounded shadow-sm ${
                        isFuture
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="text-lg font-semibold">
                        {date.toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isToday ? "Today" : isFuture ? "Future" : "Past"}
                      </span>
                    </button>
                  );
                });
              })}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
