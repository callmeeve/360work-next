import React from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { HiCamera, HiOutlineCamera } from "react-icons/hi2";

const EmployeeAttendancePage = () => {
  const data = [
    { date: "25", day: "Monday", time: "13:16:17" },
    { date: "26", day: "Tuesday", time: "13:16:17" },
    { date: "27", day: "Wednesday", time: "13:16:17" },
    { date: "28", day: "Thursday", time: "13:16:17" },
    { date: "29", day: "Friday", time: "13:16:17" },
    { date: "30", day: "Saturday", time: "13:16:17" },
    { date: "31", day: "Sunday", time: "13:16:17" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <h1 className="text-3xl font-semibold">Attendance</h1>
        <p className="text-gray-500">Welcome to the employee attendance page</p>
        <div className="mt-8 border rounded shadow-sm p-4">
          <div className="my-2">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 border rounded shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-500 text-lg">{item.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">Mar 2024</p>
                      <p className="text-sm text-gray-500">{item.day}</p>
                    </div>
                    <div className="border-r border-gray-200 h-12 hidden sm:block"></div>

                    <p className="text-sm text-gray-500 text-start sm:text-end">
                      {item.time}
                    </p>

                    <div className="flex flex-col items-start sm:items-center justify-center">
                      <label className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center cursor-pointer">
                        <HiOutlineCamera className="text-blue-500 text-lg" />
                        <input type="file" className="hidden" />
                      </label>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Ambil Foto
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
