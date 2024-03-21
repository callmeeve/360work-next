import React from "react";
import EmployeeLayout from "@/components/layouts/EmployeeLayout";
import ManagerLayout from "@/components/layouts/ManagerLayout";

function RoleBasedLayout(WrappedComponent) {
  return function Layout(props) {
    let user, role;

    if (typeof window !== 'undefined') {
      user = JSON.parse(localStorage.getItem("user"));
      role = user ? user.role : null;
    }

    if (role === "EMPLOYEE") {
      return <EmployeeLayout>{<WrappedComponent {...props} />}</EmployeeLayout>;
    } else if (role === "MANAGER") {
      return <ManagerLayout>{<WrappedComponent {...props} />}</ManagerLayout>;
    } else {
      return null;
    }
  };
}

export default RoleBasedLayout;
