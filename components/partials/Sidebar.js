import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "../data/helper/Navigation";
import Image from "next/image";

function Sidebar({ role }) {
  const router = useRouter();
  const navigation = Navigation.find((nav) => nav.role === role);
  return (
    <div className="w-64 bg-white h-screen">
      {navigation ? (
        <div className="flex-grow">
          <div className="w-full mx-auto mb-4 flex items-center justify-center border-b border-r">
            <Image
              src="/next.svg"
              className="w-20 h-[4.72rem]"
              width={24}
              height={24}
              alt="Next.js"
              priority
            />
          </div>
          <div className="p-4">
            <ul className="flex flex-col gap-y-4">
              {navigation.menu.map(({ name, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <li
                    className={`flex items-center px-4 py-2.5 rounded font-medium ${
                      router.pathname === href
                        ? "bg-blue-500 text-white"
                        : "text-gray-800 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-2" />
                    <span className="text-sm">
                      {name}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-4 flex-grow">
          <p className="text-center">No menu available</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
