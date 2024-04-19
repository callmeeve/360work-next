import React, { useState, useEffect } from "react";
import EmployeeLayout from "@/components/layouts/EmployeeLayout";
import ManagerLayout from "@/components/layouts/ManagerLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useRouter } from "next/router";

function RoleBasedLayout(WrappedComponent) {
  return function Layout(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
      if (!loading && user && !["EMPLOYEE", "MANAGER", "ADMIN"].includes(user.role)) {
        router.push("/");
      }
    }, [loading, user]);

    if (loading) {
      return <div>Loading...</div>; // Or your loading spinner
    }

    if (user.role === "EMPLOYEE") {
      return <EmployeeLayout>{<WrappedComponent {...props} />}</EmployeeLayout>;
    } else if (user.role === "MANAGER") {
      return <ManagerLayout>{<WrappedComponent {...props} />}</ManagerLayout>;
    } else if (user.role === "ADMIN") {
      return <AdminLayout>{<WrappedComponent {...props} />}</AdminLayout>;
    }
  };
}

export default RoleBasedLayout;