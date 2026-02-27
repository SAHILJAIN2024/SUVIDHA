"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Shield, Calendar, MapPin, Hash, Flame, PhoneCall
} from "lucide-react";
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
  const { login } = useAuthStore();

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
    aadhaarNo: "",
    gasNo: "",
    ivrsNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

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
          pincode: formData.pinCode,
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
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
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>

        {errors.general && (
          <div className="mb-4 text-sm text-red-500">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {step === 1 && (
            <>
              <Input label="Full Name" value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                leftIcon={<User className="h-4 w-4" />} error={errors.name}
              />
              <Input label="Email" type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />} error={errors.email}
              />
              <Input label="Phone"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />} error={errors.phone}
              />
              <Input label="Date of Birth" type="date"
                value={formData.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                leftIcon={<Calendar className="h-4 w-4" />} error={errors.dob}
              />
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full h-10 border rounded-lg px-3"
              >
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Button type="button" onClick={handleNext} className="w-full">
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <select
                value={formData.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full h-10 border rounded-lg px-3"
              >
                {stateOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <Input label="City"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                leftIcon={<MapPin className="h-4 w-4" />} error={errors.city}
              />
              <Input label="Area"
                value={formData.area}
                onChange={(e) => updateField("area", e.target.value)}
                leftIcon={<MapPin className="h-4 w-4" />} error={errors.area}
              />
              <Input label="PIN Code"
                value={formData.pinCode}
                onChange={(e) => updateField("pinCode", e.target.value.replace(/\D/g, ""))}
                leftIcon={<Hash className="h-4 w-4" />} error={errors.pinCode}
                maxLength={6}
              />
              <Input label="Aadhaar"
                value={formData.aadhaarNo}
                onChange={(e) => updateField("aadhaarNo", e.target.value.replace(/\D/g, ""))}
                maxLength={12}
                leftIcon={<Shield className="h-4 w-4" />}
              />
              <Input label="Gas No."
                value={formData.gasNo}
                onChange={(e) => updateField("gasNo", e.target.value)}
                leftIcon={<Flame className="h-4 w-4" />}
              />
              <Input label="IVRS No."
                value={formData.ivrsNo}
                onChange={(e) => updateField("ivrsNo", e.target.value)}
                leftIcon={<PhoneCall className="h-4 w-4" />}
              />

              <div className="flex gap-3">
                <Button type="button" variant="outline"
                  onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="button"
                  onClick={handleNext} className="flex-1">
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword}
              />

              <div className="flex gap-3">
                <Button type="button" variant="outline"
                  onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button type="submit"
                  isLoading={isLoading}
                  className="flex-1">
                  Register
                </Button>
              </div>
            </>
          )}

        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary-600">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}