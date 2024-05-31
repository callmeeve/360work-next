import React, { useState, useEffect } from "react";
import EmployeeLayout from "@/components/layouts/EmployeeLayout";
import ManagerLayout from "@/components/layouts/ManagerLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useRouter } from "next/router";

function RoleBasedLayout(WrappedComponent) {
  return function Layout(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Layout, setLayout] = useState(null);

    const router = useRouter();

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (!loading) {
        if (user) {
          if (!["EMPLOYEE", "MANAGER", "ADMIN"].includes(user.role)) {
            localStorage.removeItem("user");
            router.push("/");
          } else {
            const layoutMap = {
              EMPLOYEE: EmployeeLayout,
              MANAGER: ManagerLayout,
              ADMIN: AdminLayout,
            };
            setLayout(() => layoutMap[user.role]);
          }
        } else {
          router.push("/"); // Redirect if no user is found
        }
      }
    }, [loading, user, router]);

    if (loading || !Layout) {
      return (
        <div className="flex items-center justify-center h-screen">
          <svg
            className="animate-spin h-5 w-5 mr-3"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" />
          </svg>
        </div>
      );
    }

    return <Layout><WrappedComponent {...props} /></Layout>;
  };
}

export default RoleBasedLayout;
