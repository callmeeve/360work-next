import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const EmployeeDashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="my-8">
        <h1 className="text-3xl font-semibold">Employee Dashboard</h1>
        <p className="text-gray-500">Welcome to your Employee Dashboard</p>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeDashboard);
