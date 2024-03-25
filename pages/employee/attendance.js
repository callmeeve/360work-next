import React, { useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { Switch } from "@headlessui/react";

// const options = {
//   title: "Demo Title",
//   autoHide: true,
//   todayBtn: false,
//   clearBtn: true,
//   clearBtnText: "Clear",
//   maxDate: new Date("2030-01-01"),
//   minDate: new Date("1950-01-01"),
//   theme: {
//     background: "bg-white",
//     todayBtn: "",
//     clearBtn: "",
//     icons: "",
//     text: "",
//     disabledText: "text-red-500",
//     input: "",
//     inputIcon: "",
//     selected: "bg-blue-100 text-blue-400",
//   },
//   icons: {
//     // () => ReactElement | JSX.Element
//     prev: () => <HiChevronLeft className="" />,
//     next: () => <HiChevronRight className="" />,
//   },
//   datepickerClassNames: "top-12",
//   defaultDate: new Date("2022-01-01"),
//   language: "en",
//   disabledDates: [],
//   weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
//   inputNameProp: "date",
//   inputIdProp: "date",
//   inputPlaceholderProp: "Select Date",
//   inputDateFormatProp: {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   },
// };

const EmployeeAttendancePage = () => {
  //   const [show, setShow] = useState(false);

  //   const handleChange = (selectedDate) => {
  //     console.log(selectedDate);
  //   };

  //   const handleClose = (state) => {
  //     setShow(state);
  //   };

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const data = [
    { date: "25", day: "Monday", time: "13:16:17" },
    { date: "26", day: "Tuesday", time: "13:16:17" },
    { date: "27", day: "Wednesday", time: "13:16:17" },
    { date: "28", day: "Thursday", time: "13:16:17" },
    { date: "29", day: "Friday", time: "13:16:17" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-semibold">Attendance</h1>
      <p className="text-gray-500">Welcome to the employee attendance page</p>
      <div className="mt-8 border rounded shadow-sm p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Check-in / Check-out</h2>
          <div className="my-2">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 border rounded shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-500 text-lg">
                        {item.date}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">Mar 2024</p>
                      <p className="text-sm text-gray-500">{item.day}</p>
                    </div>
                    <div className="border-r border-gray-200 h-12 hidden sm:block"></div>
                    <Switch.Group>
                      <div className="flex items-center">
                        <Switch.Label className="mr-4 text-sm">
                          {isCheckedIn ? "Check in" : "Check out"}
                        </Switch.Label>
                        <Switch
                          checked={isCheckedIn}
                          onChange={setIsCheckedIn}
                          className={`${
                            isCheckedIn ? "bg-blue-600" : "bg-gray-200"
                          }
                relative inline-flex items-center h-6 rounded-full w-11`}
                        >
                          <span
                            className={`${
                              isCheckedIn ? "translate-x-6" : "translate-x-1"
                            }
                  inline-block w-4 h-4 transform bg-white rounded-full`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                    <p className="text-sm text-gray-500 text-start sm:text-end">
                      {item.time}
                    </p>
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
