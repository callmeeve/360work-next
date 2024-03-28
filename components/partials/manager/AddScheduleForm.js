import React, { useState, useEffect } from "react";
import api from "@/components/data/utils/api";

const CreateScheduleModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [days, setDays] = useState([]);
  const [workTimes, setWorkTimes] = useState([{ startTime: "", endTime: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTimeChange = (index, field, value) => {
    const newWorkTimes = [...workTimes];
    newWorkTimes[index][field] = value;
    setWorkTimes(newWorkTimes);
  };

  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/employee/all");
      const data = res.data.employees;
      setEmployees(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/manager/schedule/create", {
        startDate,
        endDate,
        days,
        employeeId,
        workTimes,
      });

      console.log(res.status);

      if (res.status === 201) {
        console.log("Schedule added successfully");
        
        setStartDate("");
        setEndDate("");
        setEmployeeId("");
        setDays([]);
        setWorkTimes([{ startTime: "", endTime: "" }]);

        alert("Schedule added successfully");
        window.location.reload();
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
        

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Create a Schedule</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="employee"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                Employee
              </label>
              <select
                id="employee"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.User.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5 flex gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Days
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={day}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDays([...days, e.target.value.toUpperCase()]);
                        } else {
                          setDays(
                            days.filter(
                              (d) => d !== e.target.value.toUpperCase()
                            )
                          );
                        }
                      }}
                      className="text-blue-500"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Work Time
              </label>
              {workTimes.map((workTime, index) => (
                <div className="flex" key={index}>
                  <input
                    type="time"
                    value={workTime.startTime}
                    onChange={(e) =>
                      handleTimeChange(index, "startTime", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mr-2"
                    required
                  />
                  <input
                    type="time"
                    value={workTime.endTime}
                    onChange={(e) =>
                      handleTimeChange(index, "endTime", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                {loading ? "Loading..." : "Create"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateScheduleModal;
