import React, { useState } from "react";

const CreateScheduleModal = ({ isOpen, onClose }) => {
  const [employee, setEmployee] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [every, setEvery] = useState([]);
  const [isFixed, setIsFixed] = useState(true);
  const [fixedTime, setFixedTime] = useState({ startTime: "", endTime: "" });
  const [flexibleTime, setFlexibleTime] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
  };

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
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Select Employee</option>
                {/* Add options for employees */}
              </select>
            </div>
            <div className="mb-5 flex gap-4">
              <div>
                <label
                  htmlFor="from"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  From
                </label>
                <input
                  type="date"
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="to"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  To
                </label>
                <input
                  type="date"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Every
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
                  <div key={day} className="basis-24">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={day}
                        checked={every.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEvery([...every, day]);
                          } else {
                            setEvery(every.filter((d) => d !== day));
                          }
                        }}
                      />
                      <span className="ml-2">{day}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-800">
                  Schedule Type
                </label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="fixed"
                    value="fixed"
                    checked={isFixed}
                    onChange={() => setIsFixed(true)}
                    className="mr-2"
                  />
                  <label htmlFor="fixed" className="mr-4">
                    Fixed
                  </label>
                  <input
                    type="radio"
                    id="flexible"
                    value="flexible"
                    checked={!isFixed}
                    onChange={() => setIsFixed(false)}
                  />
                  <label htmlFor="flexible">Flexible</label>
                </div>
              </div>
            </div>
            {isFixed ? (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-800">
                  Fixed Time
                </label>
                <div className="flex">
                  <input
                    type="time"
                    value={fixedTime.startTime}
                    onChange={(e) =>
                      setFixedTime({ ...fixedTime, startTime: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mr-2"
                    required
                  />
                  <input
                    type="time"
                    value={fixedTime.endTime}
                    onChange={(e) =>
                      setFixedTime({ ...fixedTime, endTime: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
            ) : (
              every.map((day, index) => (
                <div key={index} className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-800">
                    {day} Time
                  </label>
                  <div className="flex">
                    <input
                      type="time"
                      value={flexibleTime[index]?.startTime || ""}
                      onChange={(e) => {
                        const newTimes = [...flexibleTime];
                        newTimes[index] = {
                          ...newTimes[index],
                          startTime: e.target.value,
                        };
                        setFlexibleTime(newTimes);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mr-2"
                      required
                    />
                    <input
                      type="time"
                      value={flexibleTime[index]?.endTime || ""}
                      onChange={(e) => {
                        const newTimes = [...flexibleTime];
                        newTimes[index] = {
                          ...newTimes[index],
                          endTime: e.target.value,
                        };
                        setFlexibleTime(newTimes);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>
                </div>
              ))
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Create
            </button>
          </form>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  );
};

export default CreateScheduleModal;
