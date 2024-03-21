import React, { useEffect, useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import {
  HiBuildingOffice,
  HiBuildingOffice2,
  HiMiniUserGroup,
  HiOutlineTrash,
  HiPencilSquare,
} from "react-icons/hi2";
import api from "@/components/data/utils/api";

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/company/all");
      const data = res.data.companies;
      setCompanies(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/department/all");
      const data = res.data.departments;
      setDepartments(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
    getCompanies();
    getDepartments();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-gray-500">Welcome to the manager dashboard</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-8">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
              <HiMiniUserGroup className="text-white w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">Total Employees</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-4xl font-semibold mr-2">{employees.length}</span>
            <p className="text-gray-500">Total number of employees</p>
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
              <HiBuildingOffice className="text-white w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">Total Companies</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-4xl font-semibold mr-2">
              {companies.length}
            </span>
            <p className="text-gray-500">Total number of companies</p>
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
              <HiBuildingOffice2 className="text-white w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">Total Departments</span>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-4xl font-semibold mr-2">
              {departments.length}
            </span>
            <p className="text-gray-500">Total number of departments</p>
          </div>
        </div>
      </div>
      <div className="flex-grow my-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-col">
            <div className="-m-2 overflow-x-auto">
              <div className="p-4 min-w-full inline-block align-middle">
                <div className="border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Department
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
                      {employees.map((employee, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {employee.User.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {employee.Company.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {employee.Department.name}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerDashboard);
