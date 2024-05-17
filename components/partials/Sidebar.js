import React, { forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "../data/helper/Navigation";

const Sidebar = forwardRef(({ showNav, role }, ref) => {
  const router = useRouter();
  const navigation = Navigation.find((nav) => nav.role === role);
  return (
    <div ref={ref} className="w-64 bg-white h-screen fixed overflow-auto">
      <div className="flex justify-center mt-6 mb-14">
        <h1 className="text-2xl font-bold text-gray-800">
          360WORK.ID
        </h1>
      </div>

      <div className="flex flex-col">
        {navigation.menu.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={`pl-6 py-3 mx-2 rounded-sm text-center font-medium text-sm cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == href
                  ? "bg-indigo-500 text-white"
                  : "text-gray-800 hover:bg-indigo-100"
              }`}
            >
              <div className="mr-4">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p>{name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
