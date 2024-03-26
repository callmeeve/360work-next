import React, { useState, useEffect } from "react";
import EmployeeLayout from "@/components/layouts/EmployeeLayout";
import ManagerLayout from "@/components/layouts/ManagerLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import Unauthorized from "@/components/partials/Unauthorized";

function RoleBasedLayout(WrappedComponent) {
  return function Layout(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        setLoading(false);
      }
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Or your loading spinner
    }

    const role = user ? user.role : null;

    if (role === "EMPLOYEE") {
      return <EmployeeLayout>{<WrappedComponent {...props} />}</EmployeeLayout>;
    } else if (role === "MANAGER") {
      return <ManagerLayout>{<WrappedComponent {...props} />}</ManagerLayout>;
    } else if (role === "ADMIN") {
      return <AdminLayout>{<WrappedComponent {...props} />}</AdminLayout>;
    } else {
      return <Unauthorized />;
    }
  };
}

export default RoleBasedLayout;