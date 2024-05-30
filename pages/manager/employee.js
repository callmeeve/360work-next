import React, { useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { IoFilter } from "react-icons/io5";
import AddEmployeeForm from "@/components/partials/manager/AddEmployeeForm";
import EmployeeTable from "@/components/partials/manager/EmployeeTable";

const ManagerEmployeePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow my-8">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-2">
              <h1 className="text-2xl font-semibold text-gray-800">
                Employees
              </h1>
              <div className="flex items-center gap-x-2 ml-auto">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-green-500 text-green-500 hover:text-white hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Employee
                </button>
                <AddEmployeeForm isOpen={isOpen} onClose={closeModal} />
                <button
                  type="button"
                  className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <IoFilter className="w-5 h-5" />
                  Filter Table
                </button>
              </div>
            </div>
            <EmployeeTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerEmployeePage);
