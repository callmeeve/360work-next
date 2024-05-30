import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { useState, useEffect } from "react";
import api from "@/components/data/utils/api";
import { IoDocumentTextOutline, IoImageOutline } from "react-icons/io5";
import { HiOutlineTrash, HiPencilSquare } from "react-icons/hi2";
import AddTaskForm from "@/components/partials/manager/AddTaskForm";
import Swal from "sweetalert2";

const ManagerTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const getTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/task/all");
      const data = res.data.tasks;
      setTasks(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/api/manager/task/delete?id=${id}`);
      if (res.status === 200) {
        console.log("Task deleted successfully");
        Swal.fire({
          icon: "success",
          title: "Task deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        getTasks();
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(tasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayedTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
                Task Management
              </h1>
              <div className="flex items-center gap-x-2 ml-auto">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-green-500 text-green-500 hover:text-white hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Task
                </button>
                <AddTaskForm isOpen={isOpen} onClose={closeModal} />
              </div>
            </div>
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
                          File
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          Employee
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
                      {displayedTasks.map((task, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {task.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 lowercase">
                            {task.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {task.employee.user.email}
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
                              onClick={() => deleteTask(task.id)} 
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
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:-scale-x-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span>previous</span>
                  </button>
                  <div className="items-center hidden lg:flex gap-x-3">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-2 py-1 text-sm rounded-md ${
                          number === currentPage
                            ? "text-blue-500 bg-blue-100/60"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100"
                  >
                    <span>Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:-scale-x-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerTaskPage);
