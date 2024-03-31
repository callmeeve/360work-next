// EmployeeLayout.js
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import Header from "../partials/Header";
import { Transition } from "@headlessui/react";
import Sidebar from "../partials/Sidebar";

function ManagerLayout({ children }) {
  const [users, setUsers] = useState(null);
  const [showNav, setShowNav] = useState(true);
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

  function handleResize() {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window != undefined) {
      addEventListener("resize", handleResize);
    }

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

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
    <>
      <Header
        showNav={showNav}
        setShowNav={setShowNav}
        users={users}
        handleLogout={handleLogout}
      />
      <Transition
        as={Fragment}
        show={showNav}
        enter="transform transition duration-[400ms]"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform duration-[400ms] transition ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Sidebar showNav={showNav} role={users.role} />
      </Transition>
      <main
        className={`pt-16 transition-all duration-[400ms] ${
          showNav && !isMobile ? "pl-56" : ""
        }`}
      >
        <div className="px-4 md:px-16">{children}</div>
      </main>
    </>
  );
}

export default ManagerLayout;
