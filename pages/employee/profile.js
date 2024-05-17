import React, { useEffect, useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import api from "@/components/data/utils/api";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Image from "next/image";

const EmployeeProfilePage = () => {
  const [employee, setEmployee] = useState();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [gender, setGender] = useState("PRIA");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDataComplete, setIsDataComplete] = useState(false);

  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/employee/all");
      const data = res.data.employee;
      setEmployee(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/employee/create", {
        name,
        address,
        birth_date,
        gender,
        phone,
      });

      alert("Employee created successfully");

      setName("");
      setAddress("");
      setBirthDate("");
      setGender("PRIA");
      setPhone("");

      getEmployees();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    console.log(employee);
    setIsDataComplete(
      employee &&
        employee.name &&
        employee.address &&
        employee.birth_date &&
        employee.gender &&
        employee.phone
    );
  }, [employee]);

  return (
    <div className="flex flex-col">
      <div className="flex-grow my-8">
        <div className="p-4">
          {isDataComplete ? (
            <div
              key={employee.id || index}
              className="flex flex-col p-4 bg-white rounded-lg shadow-sm border"
            >
              <div className="p-4">
                <div className="flex items-center mb-5">
                  <Image
                    src="/avatar.svg"
                    alt="avatar"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-primary mb-2">
                      {employee.job_status}
                    </div>
                    <p className="font-bold text-lg">{employee.name}</p>
                    <p className="text-gray-500">{employee.user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                  <div>
                    <p className="font-medium text-primary">Phone</p>
                    <p className="text-gray-500 text-sm">{employee.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Birth Date</p>
                    <p className="text-gray-500 text-sm">
                      {employee.birth_date}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Gender</p>
                    <p className="text-gray-500 text-sm">{employee.gender}</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Address</p>
                    <p className="text-gray-500 text-sm">{employee.address}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-8 md:mt-5">
                  <button className="bg-primary text-white px-4 py-2 rounded">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={birth_date}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="PRIA">PRIA</option>
                    <option value="WANITA">WANITA</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  {loading ? "Loading..." : "Create"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeProfilePage);
