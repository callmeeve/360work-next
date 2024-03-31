import React, { forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navigation from "../data/helper/Navigation";
import Image from "next/image";

const Sidebar = forwardRef(({ showNav, role }, ref) => {
  const router = useRouter();
  const navigation = Navigation.find((nav) => nav.role === role);
  return (
    <div ref={ref} className="fixed w-56 h-full bg-white shadow-sm">
      <div className="flex justify-center mt-6 mb-14">
        <picture>
          <Image
            src="/next.svg"
            className="w-28 h-auto"
            width={24}
            height={24}
            alt="Next.js"
            priority
          />
        </picture>
      </div>

      <div className="flex flex-col">
        {navigation.menu.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={`pl-6 py-3 mx-5 rounded text-center font-medium text-sm cursor-pointer mb-3 flex items-center transition-colors ${
                router.pathname == href
                  ? "bg-blue-100 text-blue-500"
                  : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
              }`}
            >
              <div className="mr-2">
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
