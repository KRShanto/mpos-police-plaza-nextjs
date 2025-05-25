"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { AuthUser } from "@/lib/auth";

interface TemplateProps {
  children: ReactNode;
  user: AuthUser | null;
}

export default function Template({ children, user }: TemplateProps) {
  const pathname = usePathname();

  // Don't render template for auth pages
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      {user && <Sidebar user={user} />}
      <div className="flex-1 flex flex-col">
        {user && <Navbar user={user} />}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
