"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Smartphone } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";


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

    if (!email || !password) {
        setError("Email and password are required");
        return;
    }

    setIsLoading(true);

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            }
        );

        const data = await response.json();

        // ❌ Validation errors from express-validator
        if (!response.ok) {
            if (data.errors && Array.isArray(data.errors)) {
                setError(data.errors[0].msg);
            } else {
                setError(data.message || "Login failed");
            }
            return;
        }

        // Extra safety
        if (!data.success) {
            setError(data.message || "Login failed");
            return;
        }

        // ✅ Save auth state
        login(data.user, data.token);

        // ✅ Redirect by role
        if (data.user.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/citizen/dashboard");
        }

    } catch (error) {
        console.error("Login error:", error);
        setError("Server error. Please try again.");
    } finally {
        setIsLoading(false);
    }
};


    return (
        <div className="min-h-screen flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-[80px]" />
                    <div className="absolute bottom-20 right-20 w-56 h-56 bg-accent-400/10 rounded-full blur-[60px]" />
                </div>
                <div className="relative flex flex-col justify-center px-16">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                            S
                        </div>
                        <span className="text-2xl font-bold">SUVIDHA</span>
                    </Link>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Welcome back to<br />your civic portal
                    </h1>
                    <p className="text-lg text-white/70 max-w-md">
                        Sign in to file complaints, track resolutions, pay utility bills, and access government services.
                    </p>
                    <div className="flex items-center gap-6 mt-12 text-white/60 text-sm">
                        <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Multi-language</div>
                        <div className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> PWA Ready</div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-bg">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg flex items-center justify-center">
                            S
                        </div>
                        <span className="font-bold text-xl text-fg">SUVIDHA</span>
                    </Link>

                    <h2 className="text-2xl font-bold text-fg mb-2">Sign In</h2>
                    <p className="text-fg-secondary mb-8">
                        Enter your credentials to access your account
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-600 text-sm border border-danger-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-fg-secondary cursor-pointer">
                                <input type="checkbox" className="rounded accent-primary-600" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Quick Role Login */}
                    <div className="mt-8">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs text-fg-muted">
                                <span className="px-3 bg-bg">Quick Demo Login</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-fg-secondary">
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
