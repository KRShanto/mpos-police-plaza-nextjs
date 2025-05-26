import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Template from "../components/Template";
import { getUser } from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body className={poppins.className}>
        <Template user={user}>{children}</Template>
      </body>
    </html>
  );
}
