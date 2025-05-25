import {
  BarChart3,
  FileText,
  Package,
  Users,
  UserCircle,
  Settings,
  Scale,
} from "lucide-react";
import SidebarContent from "./SidebarContent";
import { AuthUser } from "@/lib/auth";

const adminNavItems = [
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

const cashierNavItems = [
  {
    title: "Sales Screen",
    icon: BarChart3,
    href: "/",
  },
  {
    title: "Customer Management",
    icon: UserCircle,
    href: "/customer",
  },
  {
    title: "Due Balance",
    icon: Scale,
    href: "/due",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default async function Sidebar({ user }: { user: AuthUser }) {
  const navItems = user?.role === "CASHIER" ? cashierNavItems : adminNavItems;

  return <SidebarContent navItems={navItems} />;
}
