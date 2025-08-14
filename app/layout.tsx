import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"; // ✅ Import theme provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediCare - Your Trusted Healthcare Companion",
  description:
    "Connect with qualified doctors, book appointments, and get online consultations",
  generator: "next",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {" "}
      {/* ✅ Required for theme to hydrate properly */}
      <body
        className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {" "}
          {/* ✅ Wrap in ThemeProvider */}
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
