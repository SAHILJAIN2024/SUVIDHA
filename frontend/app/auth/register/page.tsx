"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { register as mockRegister } from "@/services/auth.service";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (formData.password.length < 6) newErrors.password = "Min 6 characters";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords don't match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            const result = await mockRegister(formData);
            login(result.user, result.token);
            router.push("/citizen/dashboard");
        } catch {
            setErrors({ general: "Registration failed" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent-400/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary-400/15 rounded-full blur-[60px]" />
                </div>
                <div className="relative flex flex-col justify-center px-16">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                            S
                        </div>
                        <span className="text-2xl font-bold">SUVIDHA</span>
                    </Link>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Join the digital<br />governance revolution
                    </h1>
                    <p className="text-lg text-white/70 max-w-md mb-8">
                        Register to access all civic services, file complaints, and be part of a smarter city.
                    </p>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                        <Shield className="h-5 w-5" />
                        Your data is encrypted and secure
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-bg">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg flex items-center justify-center">
                            S
                        </div>
                        <span className="font-bold text-xl text-fg">SUVIDHA</span>
                    </Link>

                    <h2 className="text-2xl font-bold text-fg mb-2">Create Account</h2>
                    <p className="text-fg-secondary mb-8">Step {step} of 2 — {step === 1 ? "Personal Info" : "Set Password"}</p>

                    {/* Step Indicator */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary-600" : "bg-border"}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary-600" : "bg-border"}`} />
                    </div>

                    {errors.general && (
                        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-600 text-sm border border-danger-500/20">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    leftIcon={<User className="h-4 w-4" />}
                                    error={errors.name}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    leftIcon={<Mail className="h-4 w-4" />}
                                    error={errors.email}
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    leftIcon={<Phone className="h-4 w-4" />}
                                    error={errors.phone}
                                />
                                <Button type="button" size="lg" className="w-full" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                                    Continue
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 6 characters"
                                    value={formData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-fg transition-colors">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    }
                                    error={errors.password}
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    error={errors.confirmPassword}
                                />

                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button type="submit" size="lg" className="flex-1" isLoading={isLoading} rightIcon={<ArrowRight className="h-4 w-4" />}>
                                        Register
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-fg-secondary">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
