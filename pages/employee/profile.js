import React, { useEffect, useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import api from "@/components/data/utils/api";

const EmployeeProfilePage = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [gender, setGender] = useState("MALE");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDataComplete, setIsDataComplete] = useState(false);

  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/employee/all");
      const data = res.data.employees;
      setEmployees(data);
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
      setGender("MALE");
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
    setIsDataComplete(
      employees &&
        employees.length > 0 &&
        employees.every(
          (employee) =>
            employee.name &&
            employee.address &&
            employee.birth_date &&
            employee.gender &&
            employee.phone
        )
    );
  }, [employees]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          {isDataComplete && employees.length > 0 ? (
            employees.map((employee, index) => (
              <div
                key={employee.id || index}
                className="flex flex-col items-center justify-start"
              >
                <h1 className="text-3xl font-semibold">Employee Profile</h1>
                <div className="flex items-center gap-4">
                  <p className="text-gray-500">Name:</p>
                  <span>{employee.name}</span>
                </div>
              </div>
            ))
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
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
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
