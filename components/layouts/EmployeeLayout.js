// EmployeeLayout.js
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import Header from "../partials/Header";
import { Transition } from "@headlessui/react";
import Sidebar from "../partials/Sidebar";

function EmployeeLayout({ children }) {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const checkUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !storedUser || storedUser.role !== "EMPLOYEE") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } else {
      setUser(storedUser);
    }
  };

  function handleResize() {
    if (window.innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      checkUser();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex">
      <Header
        showNav={showNav}
        setShowNav={setShowNav}
        users={user}
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
        <Sidebar showNav={showNav} role={user.role} />
      </Transition>
      <main
        className={`flex-1 transition-all duration-[400ms] ${showNav ? 'pl-64' : 'pl-0'}`}
      >
        <div className="pt-16 px-4 md:px-16">{children}</div>
      </main>
    </div>
  );
}

export default EmployeeLayout;