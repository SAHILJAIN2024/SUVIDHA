"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Zap,
    Droplets,
    Flame,
    Upload,
    User,
    Home,
    FileText,
    MapPin,
} from "lucide-react";
import { Card, CardContent, Button, Input, Textarea, Select } from "@/components/ui";

const connectionTypes = [
    { id: "electricity", label: "Electricity", icon: Zap, color: "#F59E0B", desc: "New connection, load enhancement, temporary supply" },
    { id: "water", label: "Water Supply", icon: Droplets, color: "#3B82F6", desc: "New pipeline, bore well, tanker request" },
    { id: "gas", label: "Gas Pipeline", icon: Flame, color: "#EF4444", desc: "PNG connection, gas meter, safety inspection" },
];

const STEPS = ["Type", "Details", "Documents", "Review"];

export default function RequestConnectionPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        connectionType: "",
        subType: "",
        fullName: "",
        address: "",
        ward: "Ward 12",
        phone: "",
        propertyType: "residential",
        notes: "",
    });

    const update = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const canNext = () => {
        if (step === 0) return !!formData.connectionType;
        if (step === 1) return formData.fullName.length > 2 && formData.address.length > 5;
        return true;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20">
                <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-success-500" />
                </div>
                <h1 className="text-2xl font-bold text-fg mb-2">Request Submitted!</h1>
                <p className="text-fg-secondary mb-2">
                    Your {formData.connectionType} connection request has been submitted successfully.
                </p>
                <p className="text-sm text-fg-muted mb-8">
                    Request ID: <span className="font-mono font-bold">REQ-{Date.now().toString().slice(-6)}</span>
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.push("/citizen/dashboard")}>Go to Dashboard</Button>
                    <Button onClick={() => { setSubmitted(false); setStep(0); setFormData({ ...formData, connectionType: "" }); }}>New Request</Button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => (step > 0 ? setStep(step - 1) : router.back())} className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-fg">Request New Connection</h1>
                    <p className="text-fg-secondary text-sm mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-success-500 text-white" : i === step ? "bg-primary-600 text-white" : "bg-surface-muted text-fg-muted border border-border"}`}>
                                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`hidden sm:inline text-xs font-medium ${i <= step ? "text-fg" : "text-fg-muted"}`}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-success-500" : "bg-border"}`} />}
                    </React.Fragment>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    {/* Step 0: Connection Type */}
                    {step === 0 && (
                        <div className="space-y-3">
                            {connectionTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => update("connectionType", type.id)}
                                    className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formData.connectionType === type.id ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-border hover:border-border-strong bg-surface"}`}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: type.color }}>
                                        <type.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-fg">{type.label} Connection</p>
                                        <p className="text-xs text-fg-secondary mt-0.5">{type.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Details */}
                    {step === 1 && (
                        <Card>
                            <CardContent>
                                <div className="space-y-4">
                                    <Select
                                        label="Connection Sub-Type"
                                        value={formData.subType}
                                        onChange={(e) => update("subType", e.target.value)}
                                        options={
                                            formData.connectionType === "electricity"
                                                ? [{ value: "new", label: "New Connection" }, { value: "load", label: "Load Enhancement" }, { value: "temp", label: "Temporary Supply" }]
                                                : formData.connectionType === "water"
                                                    ? [{ value: "new", label: "New Pipeline" }, { value: "bore", label: "Bore Well Permit" }, { value: "tanker", label: "Tanker Request" }]
                                                    : [{ value: "png", label: "PNG Connection" }, { value: "meter", label: "Gas Meter" }, { value: "safety", label: "Safety Inspection" }]
                                        }
                                    />
                                    <Input label="Full Name" placeholder="As per ID proof" value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} leftIcon={<User className="h-4 w-4" />} />
                                    <Textarea label="Full Address" placeholder="House/Flat No, Street, Area, City, PIN..." value={formData.address} onChange={(e) => update("address", e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select label="Ward" value={formData.ward} onChange={(e) => update("ward", e.target.value)} options={[
                                            { value: "Ward 3", label: "Ward 3" }, { value: "Ward 5", label: "Ward 5" }, { value: "Ward 8", label: "Ward 8" }, { value: "Ward 12", label: "Ward 12" }, { value: "Ward 15", label: "Ward 15" },
                                        ]} />
                                        <Select label="Property Type" value={formData.propertyType} onChange={(e) => update("propertyType", e.target.value)} options={[
                                            { value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" }, { value: "industrial", label: "Industrial" },
                                        ]} />
                                    </div>
                                    <Input label="Contact Phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => update("phone", e.target.value)} />
                                    <Textarea label="Additional Notes (optional)" placeholder="Any special requirements..." value={formData.notes} onChange={(e) => update("notes", e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Documents */}
                    {step === 2 && (
                        <Card>
                            <CardContent>
                                <h3 className="text-lg font-semibold text-fg mb-4">Upload Documents</h3>
                                <div className="space-y-4">
                                    {["ID Proof (Aadhaar / PAN)", "Address Proof", "Property Ownership Document", "Passport Size Photo"].map((doc) => (
                                        <div key={doc} className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border hover:border-primary-400 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-fg-muted" />
                                                <div>
                                                    <p className="text-sm font-medium text-fg">{doc}</p>
                                                    <p className="text-xs text-fg-muted">PDF, JPG, PNG — Max 5MB</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" leftIcon={<Upload className="h-3 w-3" />}>Upload</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <Card>
                            <CardContent>
                                <h3 className="text-lg font-semibold text-fg mb-4">Review Application</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Connection Type", value: formData.connectionType },
                                        { label: "Sub-Type", value: formData.subType || "—" },
                                        { label: "Full Name", value: formData.fullName },
                                        { label: "Address", value: formData.address },
                                        { label: "Ward", value: formData.ward },
                                        { label: "Property Type", value: formData.propertyType },
                                        { label: "Phone", value: formData.phone || "—" },
                                        { label: "Notes", value: formData.notes || "—" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
                                            <span className="text-sm font-medium text-fg-secondary w-36 shrink-0">{item.label}</span>
                                            <span className="text-sm text-fg capitalize">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
                {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canNext()} rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
                ) : (
                    <Button onClick={handleSubmit} isLoading={isSubmitting} rightIcon={<CheckCircle className="h-4 w-4" />}>Submit Request</Button>
                )}
            </div>
        </div>
    );
}
