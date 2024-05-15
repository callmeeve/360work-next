import { Fragment } from "react";
import Image from "next/image";
import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import {
  HiBars3,
  HiCheckCircle,
  HiCreditCard,
  HiOutlineBell,
  HiUser,
} from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";

export default function Header({ showNav, setShowNav, users, handleLogout }) {
  return (
    <div
      className={`fixed w-full h-16 flex justify-between items-center transition-all duration-[400ms] border-b bg-white shadow-sm ${
        showNav ? "pl-56" : ""
      }`}
    >
      <div className="pl-4 md:pl-16">
        <div
          className="hover:bg-indigo-100 hover:text-indigo-500 text-gray-700 rounded-full p-2 hover:cursor-pointer"
          onClick={() => setShowNav(!showNav)}
        >
          <HiBars3 className="h-8 w-8" />
        </div>
      </div>
      <div className="flex items-center pr-4 md:pr-16">
        <Popover className="relative flex">
          <Popover.Button className="outline-none mr-5 md:mr-8 cursor-pointer text-gray-700">
            <div className="hover:bg-indigo-100 hover:text-indigo-500 rounded-full p-2 hover:cursor-pointer">
              <HiOutlineBell className="h-6 w-6" />
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Popover.Panel className="absolute top-full -right-16 sm:right-4 z-50 mt-2 bg-white border shadow-sm rounded-md max-w-xs sm:max-w-sm w-screen">
              <div className="relative p-4">
                <div className="flex justify-between items-center w-full">
                  <p className="text-gray-700 font-medium">Notifications</p>
                  <a className="text-sm text-indigo-500" href="#">
                    Mark all as read
                  </a>
                </div>
                <div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
                  <div className="flex">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <HiCheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        Notification Title
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Test Notification text for design
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <HiCheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        Notification Title
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Test Notification text for design
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <HiCheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        Notification Title
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Test Notification text for design
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <HiCheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        Notification Title
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Test Notification text for design
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex gap-2 w-full justify-center items-center hover:bg-indigo-100 py-2 px-4 rounded-full">
              <picture>
                <Image
                  className="rounded-full h-8 shadow-sm"
                  src="/avatar.svg"
                  width={40}
                  height={40}
                  alt="Avatar"
                />
              </picture>
              <div className="hidden md:flex md:flex-col items-start">
                <p className="text-gray-700 text-sm font-medium">
                  {users.username}
                </p>
                <p className="text-gray-500 text-xs lowercase">{users.role}</p>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded-md border shadow-sm">
              <div className="p-1">
                <Menu.Item>
                  <Link
                    href={`/${users.role.toLowerCase()}/profile`}
                    className="flex hover:bg-indigo-100 text-gray-800 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <HiUser className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="#"
                    className="flex hover:bg-indigo-100 text-gray-800 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <HiCreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={handleLogout}
                    className="w-full flex hover:bg-indigo-100 text-gray-800 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <IoLogOutOutline className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
