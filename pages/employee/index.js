import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { useEffect, useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { IoDocumentTextOutline, IoImageOutline } from "react-icons/io5";
import api from "@/components/data/utils/api";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTasks = async () => {
    try {
      const response = await api.get("/api/employee/task/all");
      setTasks(response.data);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="my-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <p className="text-gray-500">Welcome to your Employee Dashboard</p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error.message}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-4 rounded-md border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center border text-primary w-12 h-12 rounded-md">
                  <HiOutlineDocumentText className="h-6 w-6" />
                </div>
                <p className="text-gray-800 text-lg font-semibold">
                  Total Task
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-800 text-2xl font-bold">
                  {tasks.length}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-12">
          <div className="relative overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-white shadow-sm rounded-md border">
                <table className="w-full text-sm text-left rtl:text-right text-gray-800 ">
                  <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        File
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Manager
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {error && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-red-500 py-4"
                        >
                          {error.message}
                        </td>
                      </tr>
                    )}
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            {task.file &&
                            (task.file.endsWith(".jpg") ||
                              task.file.endsWith(".png") ||
                              task.file.endsWith(".jpeg")) ? (
                              <IoImageOutline className="w-5 h-5" />
                            ) : (
                              <IoDocumentTextOutline className="w-5 h-5" />
                            )}
                            {task.file}
                          </div>
                        </td>
                        <td className="px-6 py-4">{task.title}</td>
                        <td className="px-6 py-4">{task.description}</td>
                        <td className="px-6 py-4 lowercase">{task.status}</td>
                        <td className="px-6 py-4">{task.manager.user.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button type="button" className="text-success">
                              View
                            </button>
                            <div className="text-gray-300">|</div>
                            <button type="button" className="text-primary">
                              Add Report
                            </button>
                          </div>
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

export default RoleBasedLayout(EmployeeDashboard);
