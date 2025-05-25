"use client";

import Link from "next/link";
import {
  BarChart3,
  FileText,
  Package,
  Users,
  UserCircle,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Sales Summary",
    icon: BarChart3,
    href: "/",
  },
  {
    title: "Sales Report",
    icon: FileText,
    href: "/report",
  },
  {
    title: "Inventory Management",
    icon: Package,
    href: "/inventory",
  },
  {
    title: "Employee Management",
    icon: Users,
    href: "/employee",
  },
  {
    title: "Customer Management",
    icon: UserCircle,
    href: "/customer",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <aside className="w-[130px] bg-bg-secondary min-h-screen px-3">
      <div className="pt-6 pb-12 text-center">
        <div className="font-bold text-2xl">LOGO</div>
      </div>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-5 text-center rounded-lg transition-colors
                ${isActive ? "bg-fg-primary text-white" : "hover:bg-black/5"}`}
            >
              <item.icon className="w-7 h-7 mb-2" />
              <span className="text-sm font-medium leading-tight px-1">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
