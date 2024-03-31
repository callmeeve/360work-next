import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const EmployeeAttendancePage = () => {
  
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-semibold mb-5">Attendance</h1>
      <div className="flex-grow my-4">
        <div className="bg-white p-4 rounded border shadow-sm">
         
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
