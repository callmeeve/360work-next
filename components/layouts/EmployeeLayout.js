// EmployeeLayout.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../partials/Sidebar";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import {
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoChevronDown,
} from "react-icons/io5";
import Notification from "../data/helper/Notification";
import { HiBars3 } from "react-icons/hi2"; // Import HiMenu icon

function EmployeeLayout({ children }) {
  const [users, setUsers] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!users) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-auto h-screen">
      <Sidebar role={users.role} isMobile={isMobile} />
      <div className="flex-grow">
        <nav className="flex items-center justify-between bg-white h-[5.05rem] border-b">
          <HiBars3
            className="w-6 h-6 text-gray-800 cursor-pointer mx-5"
            onClick={() => setIsMobile(!isMobile)}
          />
          <div className="hidden md:flex flex-col items-start">
            <h1 className="font-medium">Welcome, {users.username}</h1>
            <span className="text-gray-500 text-sm lowercase">
              {users.role}
            </span>
          </div>
          <Notification />
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="flex items-center justify-end focus:outline-none">
                  <Image
                    className="rounded-full cursor-pointer"
                    src="/avatar.svg"
                    width={40}
                    height={40}
                    alt="Avatar"
                  />
                  <IoChevronDown className="text-gray-800 w-4 h-4 mx-4" />
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
        </nav>
        <main className="m-12">{children}</main>
      </div>
    </div>
  );
}

export default EmployeeLayout;
