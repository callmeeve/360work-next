import React, { useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import Datepicker from "tailwind-datepicker-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const options = {
  title: "Demo Title",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-white",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "text-red-500",
    input: "",
    inputIcon: "",
    selected: "bg-blue-100 text-blue-400",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <HiChevronLeft className="" />,
    next: () => <HiChevronRight className="" />,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
  disabledDates: [],
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

const EmployeeAttendancePage = () => {
  const [show, setShow] = useState(false);

  const handleChange = (selectedDate) => {
    console.log(selectedDate);
  };

  const handleClose = (state) => {
    setShow(state);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-semibold">Attendance</h1>
      <p className="text-gray-500">Welcome to the employee attendance page</p>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Datepicker
              options={options}
              onChange={handleChange}
              show={show}
              setShow={handleClose}
            />
          </div>
          <div className="sm:col-span-3">
            <Datepicker
              options={options}
              onChange={handleChange}
              show={show}
              setShow={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
