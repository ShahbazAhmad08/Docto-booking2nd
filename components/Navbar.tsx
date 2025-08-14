"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Calendar, Home, Menu, X, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) return null;

  const menuItems =
    user.role === "doctor"
      ? [
          { label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
          { label: "Profile", icon: User, href: "/doctor/profile" },
          {
            label: "Appointments",
            icon: Calendar,
            href: "/doctor/appointments",
          },
          {
            label: "Prescriptions",
            icon: Calendar,
            href: "/doctor/prescriptions",
          },
          { label: "Patients", icon: User, href: "/doctor/patient-history" },
          { label: "Reviews", icon: FileText, href: "/doctor/reviews" }, // ✅ Added reviews menu
        ]
      : [
          { label: "Home", icon: Home, href: "/" },
          { label: "Profile", icon: User, href: "/profile" },
          { label: "Appointments", icon: Calendar, href: "/appointments" },
          {
            label: "Prescriptions",
            icon: Calendar,
            href: `/prescriptions?patientId=${user.id}`,
          },
        ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-2 left-2  z-50 p-2 bg-black/70 text-white rounded-md hover:bg-black/90"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-md text-white shadow-lg z-40 flex flex-col justify-between"
          >
            {/* Logo */}
            <div className="p-6">
              <Link
                href={
                  user.role === "doctor"
                    ? "/doctor/dashboard"
                    : "/patient/dashboard"
                }
                className="text-3xl font-bold text-white"
              >
                DocBook
              </Link>
            </div>

            {/* Menu */}
            <div className="flex-1 px-4 space-y-3">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/10"
                    onClick={() => setIsOpen(false)} // close sidebar on click
                  >
                    <item.icon className="w-5 h-5 mr-3" /> {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-6 space-y-3">
              <ThemeToggle />
              <div className="text-sm">Welcome, {user.name}</div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
