"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Calendar, Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={user.role === "doctor" ? "/doctor/dashboard" : "/"}
              className="text-2xl font-bold text-white"
            >
              DocBook
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user.role === "patient" && (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link href="/appointments">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </Button>
                </Link>
              </>
            )}

            {user.role === "doctor" && (
              <>
                <Link href="/doctor/dashboard">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/doctor/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link href="/doctor/appointments">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </Button>
                </Link>
              </>
            )}

            <span className="text-white text-sm">Welcome, {user.name}</span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              className="ml-2 text-white focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col gap-2 pb-4 animate-fade-in-down">
            {user.role === "patient" && (
              <>
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link href="/appointments" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </Button>
                </Link>
              </>
            )}

            {user.role === "doctor" && (
              <>
                <Link
                  href="/doctor/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/doctor/profile" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link
                  href="/doctor/appointments"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Appointments
                  </Button>
                </Link>
              </>
            )}

            <span className="text-white text-sm px-4">
              Welcome, {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
