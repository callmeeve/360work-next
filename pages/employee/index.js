import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const EmployeeDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-gray-500">Welcome to the employee dashboard</p>
    </div>
  );
};

export default RoleBasedLayout(EmployeeDashboard);
