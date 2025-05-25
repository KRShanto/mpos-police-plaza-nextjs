import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Template from "./components/Template";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPOS Police Plaza",
  description: "Modern Point of Sale System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current URL from window location in client component
  return (
    <html lang="en">
      <body className={inter.className}>
        <Template>{children}</Template>
      </body>
    </html>
  );
}
