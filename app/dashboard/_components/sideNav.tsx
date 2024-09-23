"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GraduationCap, HandIcon, LayoutIcon, Settings } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";

interface MenuItem {
  id: number;
  name: string;
  icon: FC;
  path: string;
}

interface User {
  picture?: string;
  name?: string;
  email?: string;
}

const SideNav: FC =  () => {

  const user =  useCurrentUser(); 

  const userName = user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase(); 

  const manuList: MenuItem[] = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      path: "/dashboard/students",
    },
    {
      id: 3,
      name: "Attendance",
      icon: HandIcon,
      path: "/dashboard/attendance",
    },
    {
      id: 4,
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  const path = usePathname()
  useEffect(() =>{
   console.log(path)
  }, [path])
  return (
    <div className="border shadow-md h-screen p-5">
      <hr className="my-5" />
      {manuList.map((menu) => (
        <Link key={menu.id} href={menu.path}>
        <h2
          className={`flex items-center gap-3 text-md p-4 text-slate-500 hover:bg-purple-900
          hover:text-white cursor-pointer rounded-lg my-2
          ${path == menu.path && "bg-purple-900 text-slate-200"}
          `}
        >
          <menu.icon />
          {menu.name}
        </h2>
        </Link>
      ))}
      <div className="flex gap-2 items-center bottom-5 fixed p-2">
      {user?.image ? (
          <Image
            src={user.image}
            width={35}
            height={35}
            alt="user"
            className="rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-9 h-9 bg-green-700 rounded-full text-white font-bold">
            {userInitial}
          </div>
        )}
        <div>
          <h2 className="text-ss font-bold">{user?.name || "Guest"}</h2>
          <h2 className="text-xs text-slate-400">{user?.email || "guest@example.com"}</h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
