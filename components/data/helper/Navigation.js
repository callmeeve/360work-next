import { IoCalendarOutline, IoGridOutline, IoPeopleOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice, HiOutlineBuildingOffice2, HiOutlineCalendar } from "react-icons/hi2";

const Navigation = [
  {
    role: "ADMIN",
    menu: [
      { name: "Dashboard", href: "/admin", icon: IoGridOutline },
    ],
  },
  {
    role: "MANAGER",
    menu: [
      { name: "Dashboard", href: "/manager", icon: IoGridOutline },
      { name: "Employee", href: "/manager/employee", icon: IoPeopleOutline },
      { name: "Company", href: "/manager/company", icon: HiOutlineBuildingOffice },
      { name: "Department", href: "/manager/department", icon: HiOutlineBuildingOffice2 },
      { name: "Schedule", href: "/manager/schedule", icon: HiOutlineCalendar },
    ],
  },
  {
    role: "EMPLOYEE",
    menu: [
      { name: "Dashboard", href: "/employee", icon: IoGridOutline },
      { name: "Attendance", href: "/employee/attendance", icon: IoCalendarOutline },
    ],
  },
];

export default Navigation;