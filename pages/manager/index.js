import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import cn from "@/components/data/utils/cn";
// import { generateDate, months } from "@/components/data/utils/calendar";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import {
  HiOutlineBuildingOffice,
  HiOutlineBuildingOffice2,
  // HiChevronDoubleLeft,
  // HiChevronDoubleRight,
  HiOutlineUserGroup,
  HiOutlineMagnifyingGlass,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import api from "@/components/data/utils/api";
import { IoFilterOutline } from "react-icons/io5";

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const days = ["S", "M", "T", "W", "T", "F", "S"];
  // const currentDate = dayjs();
  // const [today, setToday] = useState(currentDate);
  // const [selectDate, setSelectDate] = useState(currentDate);

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
    <div className="flex flex-col">
      <div className="my-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome to the Manager Dashboard</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-md border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center border text-primary w-12 h-12 rounded-md">
                <HiOutlineUserGroup className="h-6 w-6" />
              </div>
              <p className="text-gray-800 text-lg font-semibold">
                Total Employees
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 text-2xl font-bold">
                {employees.length}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center border text-primary w-12 h-12 rounded-md">
                <HiOutlineBuildingOffice className="h-6 w-6" />
              </div>
              <p className="text-gray-800 text-lg font-semibold">
                Total Companies
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 text-2xl font-bold">
                {companies.length}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center border text-primary w-12 h-12 rounded-md">
                <HiOutlineBuildingOffice2 className="h-6 w-6" />
              </div>
              <p className="text-gray-800 text-lg font-semibold">
                Total Departments
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 text-2xl font-bold">
                {departments.length}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative text-gray-800 ">
                <input
                  type="text"
                  className="w-96 h-12 border rounded-lg px-4 placeholder:text-gray-800"
                  placeholder="Search by name, role, department..."
                  name="search"
                />
                <button className="absolute right-0 top-0 h-12 w-12 rounded-lg flex items-center justify-center">
                  <HiOutlineMagnifyingGlass className="h-6 w-6" />
                </button>
              </div>
              <button className="text-gray-800 h-12 px-4 border rounded-lg flex items-center gap-2">
                <span className="mr-2">Filter</span>
                <IoFilterOutline className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-800 h-12 px-4 border rounded-lg flex items-center gap-2">
                <HiChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button className="text-gray-800 h-12 px-4 border rounded-lg flex items-center gap-2">
                <span>Next</span>
                <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative overflow-x-auto mt-8">
            <div className="min-w-full">
              <div className="bg-white shadow-sm rounded-md border">
                <table className="w-full text-sm text-left rtl:text-right text-gray-800 ">
                  <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Job Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                          {employee.User.email}
                        </td>
                        <td className="px-6 py-4">{employee.job_status}</td>
                        <td className="px-6 py-4">
                          {employee.Department.name}
                        </td>
                        <td className="px-6 py-4">{employee.Company.name}</td>
                        <td className="px-6 py-4">
                          <button className="text-primary mr-2">Edit</button>
                          <button className="text-danger">Delete</button>
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
  );
};

export default RoleBasedLayout(ManagerDashboard);
