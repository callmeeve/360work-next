import { useEffect, useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const ManagerProfilePage = () => {
  const [users, setUsers] = useState(null);

  const checkUser = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token) {
      router.push("/");
    } else if (user) {
      setUsers(user);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (!users) {
    return null; // or a loading spinner, etc.
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="p-8 bg-white border rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800">
            Personal Information
          </h1>
          <div className="mt-4">
            <form>
              <div className="flex flex-col w-full mb-5">
                <label htmlFor="name" className="text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={users.username}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col w-full mb-5">
                <label htmlFor="email" className="text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={users.email}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col w-full mb-5">
                <label htmlFor="phone" className="text-sm font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col w-full mb-5">
                <label htmlFor="address" className="text-sm font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col w-full mb-5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerProfilePage);
