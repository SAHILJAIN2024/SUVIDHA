"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Smartphone } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { login as mockLogin } from "@/services/auth.service";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await mockLogin(email, password);
            if (result) {
                login(result.user, result.token);
                const role = result.user.role;
                if (role === "citizen") {
                    router.push("/citizen/dashboard");
                } else {
                    router.push("/admin/dashboard");
                }
            } else {
                setError("Invalid credentials");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsRole = async (role: string) => {
        setIsLoading(true);
        const emails: Record<string, string> = {
            citizen: "rajesh@example.com",
            admin: "priya.admin@suvidha.gov",
            super: "anil.super@suvidha.gov",
        };
        const result = await mockLogin(emails[role] || emails.citizen, "demo");
        if (result) {
            login(result.user, result.token);
            if (result.user.role === "citizen") {
                router.push("/citizen/dashboard");
            } else {
                router.push("/admin/dashboard");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 bg-white/5 rounded-full blur-[60px] md:blur-[80px]" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-accent-400/10 rounded-full blur-[40px] md:blur-[60px]" />
                </div>
                <div className="relative flex flex-col justify-center items-center text-center w-full px-6 lg:px-16">
                    <Link href="/" className="flex items-center gap-2 lg:gap-3 mb-8 lg:mb-12">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl lg:text-2xl font-bold">
                            S
                        </div>
                        <span className="text-xl lg:text-2xl font-bold">SUVIDHA</span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 lg:mb-4 max-w-lg">
                        Welcome back to<br />your civic portal
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-white/70 max-w-md">
                        Sign in to file complaints, track resolutions, pay utility bills, and access government services.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 mt-8 lg:mt-12 text-white/60 text-xs lg:text-sm">
                        <div className="flex items-center gap-2"><Globe className="h-3 w-3 lg:h-4 lg:w-4" /> Multi-language</div>
                        <div className="flex items-center gap-2"><Smartphone className="h-3 w-3 lg:h-4 lg:w-4" /> PWA Ready</div>
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
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-2 mb-6 sm:mb-8">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-base sm:text-lg flex items-center justify-center">
                            S
                        </div>
                        <span className="font-bold text-lg sm:text-xl text-fg">SUVIDHA</span>
                    </Link>

                    <h2 className="text-xl sm:text-2xl font-bold text-fg mb-1 sm:mb-2">Sign In</h2>
                    <p className="text-xs sm:text-sm text-fg-secondary mb-6 sm:mb-8">
                        Enter your credentials to access your account
                    </p>

                    {error && (
                        <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-danger-50 text-danger-600 text-xs sm:text-sm border border-danger-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="h-4 w-4" />}
                            required
                        />
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock className="h-4 w-4" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="hover:text-fg transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            }
                            required
                        />

                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <label className="flex items-center gap-2 text-fg-secondary cursor-pointer">
                                <input type="checkbox" className="rounded accent-primary-600" />
                                <span className="hidden sm:inline">Remember me</span>
                                <span className="sm:hidden">Remember</span>
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot?
                            </a>
                        </div>

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

                    {/* Quick Role Login */}
                    <div className="mt-6 sm:mt-8">
                        <div className="relative mb-3 sm:mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs text-fg-muted">
                                <span className="px-2 sm:px-3 bg-bg text-[10px] sm:text-xs">Quick Demo Login</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" onClick={() => loginAsRole("citizen")} disabled={isLoading} className="text-xs sm:text-sm">
                                Citizen
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => loginAsRole("admin")} disabled={isLoading} className="text-xs sm:text-sm">
                                Admin
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => loginAsRole("super")} disabled={isLoading} className="text-xs sm:text-sm">
                                <span className="hidden sm:inline">Super Admin</span>
                                <span className="sm:hidden">Super</span>
                            </Button>
                        </div>
                    </div>

                    <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-fg-secondary">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="text-primary-600 font-medium hover:text-primary-700">
                            Register here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
