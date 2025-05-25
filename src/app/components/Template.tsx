"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();

  // Don't render template for auth pages
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
