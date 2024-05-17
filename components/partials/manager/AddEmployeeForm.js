import { useState, useEffect } from "react";
import api from "@/components/data/utils/api";

export default function AddEmployeeForm({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job_status, setJobStatus] = useState("PERMANENT");
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    getDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/manager/employee/create", {
        username,
        email,
        password,
        job_status,
        departmentId,
        workStart,
        workEnd,
      });

      if (res.status === 200) {
        console.log("Employee added successfully");
        setUsername("");
        setEmail("");
        setPassword("");
        setJobStatus("PERMANENT");
        setWorkStart("");
        setWorkEnd("");
        setDepartmentId("");


        alert("Employee added successfully");
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
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <div className="w-1/2 rounded bg-white p-12">
          <h3 className="text-xl leading-6 font-semibold text-gray-800">
            Add Employee
          </h3>
          <div className="mt-4">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="jobStatus"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Job Status
                </label>
                <select
                  id="jobStatus"
                  value={job_status}
                  onChange={(e) => setJobStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Select job status</option>
                  <option value="PERMANENT">PERMANENT</option>
                  <option value="CONTRACT">CONTRACT</option>
                  <option value="PROJECT">PROJECT</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-800">
                  Work Hours
                </label>
                <div className="flex items-center">
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                    placeholder="Start"
                    required
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                    placeholder="End"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="departmentId"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Department ID
                </label>
                <select
                  id="departmentId"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {loading ? "Loading..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
