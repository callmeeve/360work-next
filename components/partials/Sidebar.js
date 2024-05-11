import React, { forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "../data/helper/Navigation";
import Image from "next/image";

const Sidebar = forwardRef(({ showNav, role }, ref) => {
  const router = useRouter();
  const navigation = Navigation.find((nav) => nav.role === role);
  return (
    <div ref={ref} className="w-64 bg-gray-50">
      <div className="flex justify-center mt-6 mb-14">
        {/* <picture>
          <Image
            src="/next.svg"
            className="w-28 h-auto"
            width={24}
            height={24}
            alt="Next.js"
            priority
          />
        </picture> */}
        <h1 className="text-2xl font-bold text-gray-800">
          360WORK.ID
        </h1>
      </div>

      <div className="flex flex-col">
        {navigation.menu.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={`pl-6 py-3 mx-2 rounded-lg text-center font-medium text-sm cursor-pointer mb-1 flex items-center transition-colors ${
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
