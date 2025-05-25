import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Template from "../components/Template";
import { getUser } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPOS Police Plaza",
  description: "Modern Point of Sale System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Template user={user}>{children}</Template>
      </body>
    </html>
  );
}
