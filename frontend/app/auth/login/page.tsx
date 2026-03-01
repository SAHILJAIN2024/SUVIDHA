"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Smartphone, Shield } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `https://suvidha-qxz1.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log("Login response:", data);
      if (!res.ok) {
        throw new Error(data.message);
      }


      login(data.user, data.token);
      router.push(
        data.user.role === "admin"
          ? "/admin/dashboard"
          : "/citizen/dashboard"
      );

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent-400/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary-400/15 rounded-full blur-[60px]" />
        </div>
        <div className="relative flex flex-col justify-center items-center text-center px-16 w-full z-10">
          <Link href="/" className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
              S
            </div>
            <span className="text-2xl font-bold">SUVIDHA</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to<br />SUVIDHA
          </h1>
          <p className="text-lg text-white/70 max-w-md mb-8 mx-auto">
            Sign in to access civic services, file complaints, pay utility bills, and stay connected with your city.
          </p>
          <div className="flex items-center justify-center gap-3 text-white/60 text-sm">
            <Shield className="h-5 w-5" />
            Your data is encrypted and securely stored
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg overflow-y-auto w-full lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg flex items-center justify-center">
              S
            </div>
            <span className="font-bold text-xl text-fg">SUVIDHA</span>
          </Link>

          <h2 className="text-xl sm:text-2xl font-bold text-fg mb-1 sm:mb-2">Sign In</h2>

          {error && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-danger-50 text-danger-600 text-xs sm:text-sm border border-danger-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // leftIcon={<Mail className="h-5 w-5" />}
              required
              className="pl-12"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-primary-500 transition-colors p-1"
                >
                  {/* {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />} */}
                </button>
              }
              required
            // className="pl-12 pr-12"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full text-sm sm:text-base"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-fg-secondary">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary-600 font-medium hover:text-primary-700">
              Register now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
