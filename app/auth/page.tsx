"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import {
  Heart,
  User,
  Mail,
  Phone,
  Lock,
  Stethoscope,
  GraduationCap,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from "lucide-react";

// Reusable AuthForm Component
const AuthForm = ({
  isLogin,
  setIsLogin,
  isDoctor,
  setIsDoctor,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
  showPassword,
  setShowPassword,
  isMobile = false,
}) => (
  <div className="relative z-10 w-full max-w-md">
    {/* Header */}
    <div className="text-center mb-8 animate-fadeInUp">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          Medi<span className="text-blue-500">Care</span>
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-2">
        {isLogin ? "Welcome Back!" : "Join MediCare"}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {isLogin
          ? "Sign in to continue your health journey"
          : "Start your healthcare journey today"}
      </p>
    </div>

    {/* Main Card */}
    <Card className="shadow-2xl animate-fadeInUp animation-delay-200">
      <CardContent className="p-6 sm:p-8">
        {/* Role Toggle */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-8 p-3 bg-gray-100 dark:bg-slate-800 rounded-2xl">
          <div
            className={`flex items-center space-x-2 transition-all duration-300 ${
              !isDoctor
                ? "text-blue-500 scale-110"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <User className="w-5 h-5" />
            <Label
              htmlFor={`role-switch-${isMobile ? "mobile" : "desktop"}`}
              className="font-semibold cursor-pointer"
            >
              Patient
            </Label>
          </div>
          <Switch
            id={`role-switch-${isMobile ? "mobile" : "desktop"}`}
            checked={isDoctor}
            onCheckedChange={setIsDoctor}
            className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-blue-600"
          />
          <div
            className={`flex items-center space-x-2 transition-all duration-300 ${
              isDoctor
                ? "text-purple-500 scale-110"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <Label
              htmlFor={`role-switch-${isMobile ? "mobile" : "desktop"}`}
              className="font-semibold cursor-pointer"
            >
              Doctor
            </Label>
          </div>
        </div>

        {/* Auth Toggle Buttons */}
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-8">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isLogin
                ? "bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-50 shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              !isLogin
                ? "bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-50 shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="animate-slideInLeft">
              <Label htmlFor={`name-${isMobile ? "mobile" : "desktop"}`}>
                Full Name
              </Label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id={`name-${isMobile ? "mobile" : "desktop"}`}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div className="animate-slideInLeft animation-delay-100">
            <Label htmlFor={`email-${isMobile ? "mobile" : "desktop"}`}>
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id={`email-${isMobile ? "mobile" : "desktop"}`}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-12 h-14 rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="animate-slideInLeft animation-delay-200">
              <Label htmlFor={`phone-${isMobile ? "mobile" : "desktop"}`}>
                Phone Number
              </Label>
              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id={`phone-${isMobile ? "mobile" : "desktop"}`}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          )}

          <div className="animate-slideInLeft animation-delay-300">
            <Label htmlFor={`password-${isMobile ? "mobile" : "desktop"}`}>
              Password
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id={`password-${isMobile ? "mobile" : "desktop"}`}
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && isDoctor && (
            <div className="space-y-6 animate-slideInLeft animation-delay-400">
              {/* Doctor-specific fields like specialty, qualifications, etc. would go here */}
            </div>
          )}

          <Button
            type="submit"
            className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isDoctor
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            } shadow-2xl animate-slideInUp animation-delay-500 text-white`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              `${isLogin ? "Sign In" : "Create Account"} as ${
                isDoctor ? "Doctor" : "Patient"
              }`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
);

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-6 right-6 z-50 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialty: "",
    qualifications: "",
    experience: "",
    clinicAddress: "",
  });

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const user = await authAPI.login(
          formData.email,
          formData.password,
          isDoctor ? "doctor" : "patient"
        );
        login(user);
        router.push(isDoctor ? "/doctor/dashboard" : "/");
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
      } else {
        const user = await authAPI.signup(
          formData,
          isDoctor ? "doctor" : "patient"
        );
        login(user);
        router.push(isDoctor ? "/doctor/dashboard" : "/");
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description:
          error instanceof Error ? error.message : "Authentication failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formProps = {
    isLogin,
    setIsLogin,
    isDoctor,
    setIsDoctor,
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    showPassword,
    setShowPassword,
  };

  return (
    <>
      <ThemeToggle />
      {/* Desktop Layout - Split Screen */}
      <div className="hidden lg:flex min-h-screen bg-white dark:bg-slate-900">
        <div className="flex-1 flex items-start justify-center pt-32 p-12 relative overflow-hidden">
          <div className="relative z-10 text-center animate-fadeInUp">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <span className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                Medi<span className="text-blue-500">Care</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-50">
              Welcome to MediCare
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Your trusted healthcare companion. Connect with qualified doctors
              and manage your health journey with ease.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-12 relative overflow-hidden">
          <AuthForm {...formProps} />
        </div>
      </div>

      {/* Mobile Layout - Full Experience */}
      <div className="lg:hidden min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <AuthForm {...formProps} isMobile />
      </div>
    </>
  );
}
