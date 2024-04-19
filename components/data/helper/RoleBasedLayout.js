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
      if (!loading && user) {
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
      }
    }, [loading, user]);

    if (loading || !Layout) {
      return (
        <div className="flex items-center justify-center h-screen">
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
        </div>
      );
    }

    return <Layout>{<WrappedComponent {...props} />}</Layout>;
  };
}

export default RoleBasedLayout;
