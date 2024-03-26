import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../partials/Sidebar";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { IoLogOutOutline, IoPersonCircleOutline, IoChevronDown } from "react-icons/io5";

function AdminLayout({ children }) {
  const [users, setUsers] = useState(null);
  const router = useRouter();

  const checkUser = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token) {
      router.push("/login/admin");
    } else if (user) {
      setUsers(user);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login/admin");
  };

  if (!users) {
    return null; // or a loading spinner, etc.
  }

  return (
    <div className="flex flex-auto h-screen">
      <Sidebar role={users.role} />
      <div className="flex-grow">
        <nav className="bg-white p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className="font-medium">Welcome, {users.username}</h1>
              <span className="text-gray-500 text-sm lowercase">{users.role}</span>
            </div>
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button  className="flex items-center justify-end focus:outline-none">
                    <Image
                      className="rounded-full cursor-pointer"
                      src="/avatar.svg"
                      width={40}
                      height={40}
                      alt="Avatar"
                    />
                    <IoChevronDown className="text-gray-800 w-4 h-4 ml-2" />
                  </Popover.Button>
                  <Popover.Panel
                    className={`${
                      open ? "block" : "hidden"
                    } absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg`}
                  >
                    <ul className="flex flex-col gap-y-2 p-2">
                      <li>
                        <Link
                          href="/employee/profile"
                          className="w-full flex items-center text-gray-800 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md"
                        >
                          <IoPersonCircleOutline className="w-6 h-6 mr-2" />
                          <span className="text-sm">Profile</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center text-gray-800 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md"
                        >
                          <IoLogOutOutline className="w-6 h-6 mr-2" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </li>
                    </ul>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
        </nav>
        <main className="m-5">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
