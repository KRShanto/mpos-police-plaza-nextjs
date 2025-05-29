"use client";

import { MessageSquare, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="p-6 space-y-6">
      <div className="w-full grid grid-cols-3 gap-3 p-0">
        <Link
          href="/customer"
          className={`flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl text-base font-medium transition-colors ${
            pathname === "/customer"
              ? "bg-fg-primary text-white"
              : "bg-fg-secondary/90 hover:bg-fg-primary/70"
          }`}
        >
          <Users className="h-5 w-5" />
          All Customer
        </Link>
        <Link
          href="/customer/feedback"
          className={`flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl text-base font-medium transition-colors ${
            pathname === "/customer/feedback"
              ? "bg-fg-primary text-white"
              : "bg-fg-secondary/90 hover:bg-fg-primary/70"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          Customer Feedback
        </Link>
        <Link
          href="/customer/payment"
          className={`flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl text-base font-medium transition-colors ${
            pathname === "/customer/payment"
              ? "bg-fg-primary text-white"
              : "bg-fg-secondary/90 hover:bg-fg-primary/70"
          }`}
        >
          <Wallet className="h-5 w-5" />
          Payment History
        </Link>
      </div>

      {children}
    </div>
  );
}
