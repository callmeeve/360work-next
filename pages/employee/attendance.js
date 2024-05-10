import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import Attendance from "@/components/partials/employee/attendance";

const EmployeeAttendancePage = () => {
  return (
    <div className="flex flex-col">
      <div className="my-8">
        <Attendance />
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
