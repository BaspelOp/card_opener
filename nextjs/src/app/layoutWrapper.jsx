"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return (
      <html lang="en" className="h-full bg-white select-none">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-white text-black`}
        >
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full bg-white select-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-white text-black`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
