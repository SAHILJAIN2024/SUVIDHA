"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User, Mail, Phone, Lock, Eye, EyeOff,
    Shield, Calendar, MapPin, Hash, Flame, PhoneCall,
    ArrowLeft, ArrowRight, Loader2, Navigation, CheckCircle, AlertCircle
} from "lucide-react";
import { fetchUserLocation, GeoStatus } from "@/services/geolocation.service";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
];

const stateOptions = [
    { value: "", label: "Select State" },
    { value: "Assam", label: "Assam" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Bihar", label: "Bihar" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Delhi", label: "Delhi" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Karnataka", label: "Karnataka" },
];

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        gender: "",
        state: "",
        city: "",
        area: "",
        pinCode: "",
        ward: "",
        aadhaarNo: "",
        gasNo: "",
        ivrsNo: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [step, setStep] = useState(1);
    const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
    const [wardDisplay, setWardDisplay] = useState("");
    const [wardAutoDetected, setWardAutoDetected] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    /* ---------------- VALIDATION ---------------- */

    const validatePassword = (password: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Full name required";
        if (!formData.email.trim()) newErrors.email = "Email required";
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
            newErrors.phone = "Phone must be 10 digits";
        if (!formData.dob) newErrors.dob = "DOB required";
        if (!formData.gender) newErrors.gender = "Gender required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.state) newErrors.state = "State required";
        if (!formData.city.trim()) newErrors.city = "City required";
        if (!formData.area.trim()) newErrors.area = "Area required";
        if (!formData.ward) newErrors.ward = "Ward required";
        if (!/^\d{6}$/.test(formData.pinCode))
            newErrors.pinCode = "Valid 6-digit PIN required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: Record<string, string> = {};

        if (!validatePassword(formData.password))
            newErrors.password =
                "Min 8 chars with uppercase, lowercase, number & special character";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep3()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                phone: formData.phone.replace(/\D/g, ""),
                dob: formData.dob,
                gender: formData.gender,
                adhaar_no: formData.aadhaarNo
                    ? formData.aadhaarNo.replace(/\D/g, "")
                    : "",
                gas_no: formData.gasNo || "",
                ivrs_no: formData.ivrsNo || "",
                address: {
                    state: formData.state,
                    city: formData.city.trim(),
                    area: formData.area.trim(),
                    ward: formData.ward,
                    pincode: formData.pinCode,
                },
            };

            const response = await fetch(
                "https://suvidha-qxz1.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const backendErrors: Record<string, string> = {};
                    data.errors.forEach((err: any) => {
                        backendErrors[err.path] = err.msg;
                    });
                    setErrors(backendErrors);
                } else {
                    setErrors({ general: data.message || "Registration failed" });
                }
                return;
            }

            login(data.user, data.token);
            router.push("/citizen/dashboard");

        } catch (error) {
            console.error(error);
            setErrors({ general: "Server error. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen flex">
            {/* Left Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white">
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
                        Join the digital<br />governance revolution
                    </h1>
                    <p className="text-lg text-white/70 max-w-md mb-8 mx-auto">
                        Register to access civic services, file complaints, pay utility bills, and be part of a smarter city.
                    </p>
                    <div className="flex items-center justify-center gap-3 text-white/60 text-sm">
                        <Shield className="h-5 w-5" />
                        Your data is encrypted and securely stored
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-bg overflow-y-auto">
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
                    <p className="text-fg-secondary mb-6">
                        Step {step} of {totalSteps} —{" "}
                        {step === 1 ? "Personal Info" : step === 2 ? "Address Details" : "Set Password"}
                    </p>

                    {/* Step Indicator */}
                    <div className="flex gap-2 mb-6">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${step > i ? "bg-primary-600" : "bg-border"}`}
                            />
                        ))}
                    </div>

                    {errors.general && (
                        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-600 text-sm border border-danger-500/20">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* ── Step 1: Personal Info ── */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    // leftIcon={<User className="h-5 w-5" />}
                                    error={errors.name}
                                    className="pl-12"
                                    containerClassName="my-5"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    // leftIcon={<Mail className="h-5 w-5" />}
                                    error={errors.email}
                                    className="pl-12"
                                    containerClassName="my-5"
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    // leftIcon={<Phone className="h-5 w-5" />}
                                    error={errors.phone}
                                    className="pl-12"
                                    containerClassName="my-5"
                                />
                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => updateField("dob", e.target.value)}
                                    // leftIcon={<Calendar className="h-5 w-5" />}
                                    error={errors.dob}
                                    className="pl-12"
                                    containerClassName="my-5"
                                />
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-fg mb-1.5">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => updateField("gender", e.target.value)}
                                        className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    >
                                        {genderOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.gender && <p className="mt-1 text-xs text-danger-500">{errors.gender}</p>}
                                </div>
                                <Button type="button" size="lg" className="w-full" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                                    Continue
                                </Button>
                            </motion.div>
                        )}

                        {/* ── Step 2: Address & IDs ── */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                {/* Ward auto-detect */}
                                <div className="p-4 rounded-xl border border-border bg-surface">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-fg">Ward Number</p>
                                            <p className="text-xs text-fg-muted">Auto-detect using your location</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant={geoStatus === "success" ? "outline" : "primary"}
                                            size="sm"
                                            onClick={async () => {
                                                setGeoStatus("requesting");
                                                const res = await fetchUserLocation();
                                                setGeoStatus(res.status);
                                                if (res.status === "success" && res.result) {
                                                    const { wardNumber, wardName, city, state, pinCode, area } = res.result;

                                                    // Auto-fill all address fields
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        ward: wardNumber,
                                                        city: city || prev.city,
                                                        state: state || prev.state,
                                                        pinCode: pinCode || prev.pinCode,
                                                        area: area || prev.area
                                                    }));

                                                    setWardDisplay(`${wardNumber} — ${wardName}`);
                                                    setWardAutoDetected(true);
                                                } else {
                                                    setErrors((prev) => ({ ...prev, ward: res.error || "Location failed" }));
                                                }
                                            }}
                                            disabled={geoStatus === "requesting" || geoStatus === "fetching"}
                                            leftIcon={
                                                geoStatus === "requesting" || geoStatus === "fetching"
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : geoStatus === "success"
                                                        ? <CheckCircle className="h-4 w-4" />
                                                        : <Navigation className="h-4 w-4" />
                                            }
                                        >
                                            {geoStatus === "requesting" ? "Detecting..." : geoStatus === "success" ? "Detected" : "Detect Location"}
                                        </Button>
                                    </div>
                                    {geoStatus === "success" && wardDisplay && (
                                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-success-50 dark:bg-success-500/10 text-sm border border-success-500/20 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success-500 shrink-0" />
                                                <span className="text-success-700 dark:text-success-400 font-medium">Location Detected!</span>
                                            </div>
                                            <p className="text-xs text-success-600 dark:text-success-400/80 ml-6">
                                                Assigned to <span className="font-bold">{wardDisplay}</span>. Address fields have been auto-filled.
                                            </p>
                                        </div>
                                    )}
                                    {(geoStatus === "denied" || geoStatus === "unavailable" || geoStatus === "error") && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-warning-50 dark:bg-warning-500/10 text-sm">
                                            <AlertCircle className="h-4 w-4 text-warning-500 shrink-0" />
                                            <span className="text-warning-700 dark:text-warning-400">{errors.ward || "Could not detect. Enter manually below."}</span>
                                        </div>
                                    )}
                                    {!wardAutoDetected && (
                                        <div className="mt-2">
                                            <select
                                                value={formData.ward || ""}
                                                onChange={(e) => { updateField("ward", e.target.value); setWardAutoDetected(false); }}
                                                className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            >
                                                <option value="">Select Ward Manually</option>
                                                <option value="Ward 1">Ward 1</option>
                                                <option value="Ward 3">Ward 3</option>
                                                <option value="Ward 5">Ward 5</option>
                                                <option value="Ward 8">Ward 8</option>
                                                <option value="Ward 12">Ward 12</option>
                                                <option value="Ward 15">Ward 15</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-fg mb-1.5">State</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => updateField("state", e.target.value)}
                                        className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    >
                                        {stateOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="mt-1 text-xs text-danger-500">{errors.state}</p>}
                                </div>
                                <Input
                                    label="City"
                                    placeholder="e.g., Silchar"
                                    value={formData.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    // leftIcon={<MapPin className="h-5 w-5" />}
                                    error={errors.city}
                                    className="pl-12"
                                />
                                <Input
                                    label="Area / Locality"
                                    placeholder="e.g., Tarapur"
                                    value={formData.area}
                                    onChange={(e) => updateField("area", e.target.value)}
                                    // leftIcon={<MapPin className="h-5 w-5" />}
                                    error={errors.area}
                                    className="pl-12"
                                />
                                <Input
                                    label="PIN Code"
                                    placeholder="6-digit PIN code"
                                    value={formData.pinCode}
                                    onChange={(e) => updateField("pinCode", e.target.value)}
                                    // leftIcon={<Hash className="h-5 w-5" />}
                                    error={errors.pinCode}
                                    maxLength={6}
                                    className="pl-12"
                                />
                                <Input
                                    label="Aadhaar Number"
                                    placeholder="XXXX-XXXX-XXXX"
                                    value={formData.aadhaarNo}
                                    onChange={(e) => updateField("aadhaarNo", e.target.value)}
                                    // leftIcon={<Shield className="h-5 w-5" />}
                                    hint="Optional — required for KYC verification"
                                    className="pl-12"
                                />
                                <Input
                                    label="Gas Connection No."
                                    placeholder="e.g., GAS-91234"
                                    value={formData.gasNo}
                                    onChange={(e) => updateField("gasNo", e.target.value)}
                                    // leftIcon={<Flame className="h-5 w-5" />}
                                    hint="Optional — link your gas account"
                                    className="pl-12"
                                />
                                <Input
                                    label="IVRS Number"
                                    placeholder="e.g., IVRS-7821"
                                    value={formData.ivrsNo}
                                    onChange={(e) => updateField("ivrsNo", e.target.value)}
                                    // leftIcon={<PhoneCall className="h-5 w-5" />}
                                    hint="Optional — for automated helpline"
                                    className="pl-12"
                                />

                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                                        Back
                                    </Button>
                                    <Button type="button" size="lg" className="flex-1" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                                        Continue
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 3: Password ── */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 6 characters"
                                    value={formData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    // leftIcon={<Lock className="h-5 w-5" />}
                                    rightIcon={
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-primary-500 transition-colors p-1">
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    }
                                    error={errors.password}
                                    className="pl-12 pr-12"
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                    // leftIcon={<Lock className="h-5 w-5" />}
                                    error={errors.confirmPassword}
                                    className="pl-12"
                                />
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
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
