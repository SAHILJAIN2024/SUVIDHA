"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    MapPin,
    Upload,
    FileText,
    Zap,
    Droplets,
    Route,
    Recycle,
    Navigation,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, Button, Input, Textarea, Select } from "@/components/ui";
import { createComplaint } from "@/services/complaint.service";
import { fetchUserLocation, GeoStatus } from "@/services/geolocation.service";

const STEPS = ["Department", "Details", "Location", "Review"];

const departments = [
    { id: "electricity", label: "Electricity", icon: Zap, color: "#F59E0B", desc: "Power outages, streetlights, transformers" },
    { id: "water", label: "Water Supply", icon: Droplets, color: "#3B82F6", desc: "Leaks, supply issues, meters" },
    { id: "roads", label: "Roads & Infrastructure", icon: Route, color: "#8B5CF6", desc: "Potholes, signage, construction" },
    { id: "sanitation", label: "Sanitation", icon: Recycle, color: "#10B981", desc: "Garbage, drainage, cleanliness" },
];

export default function NewComplaintPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        department: "",
        title: "",
        description: "",
        priority: "medium",
        ward: "Ward 12",
        lat: "28.4595",
        lng: "77.0266",
    });
    const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
    const [submitError, setSubmitError] = useState<string | null>(null);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const canNext = () => {
        if (step === 0) return !!formData.department;
        if (step === 1) return formData.title.length >= 5 && formData.description.length >= 10;
        return true;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await createComplaint({
                title: formData.title,
                description: formData.description,
                department: formData.department as "electricity" | "water" | "roads" | "sanitation",
                priority: formData.priority as "low" | "medium" | "high" | "critical",
                ward: formData.ward,
                location: { lat: Number(formData.lat), lng: Number(formData.lng) },
            });
            router.push("/citizen/complaints");
        } catch {
            setSubmitError("Failed to submit complaint. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDetectLocation = async () => {
        setGeoStatus("requesting");
        const res = await fetchUserLocation();
        setGeoStatus(res.status);
        if (res.status === "success" && res.result) {
            setFormData((prev) => ({
                ...prev,
                lat: res.result!.latitude.toFixed(4),
                lng: res.result!.longitude.toFixed(4),
                ward: res.result!.wardNumber,
            }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
                    className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-fg">File New Complaint</h1>
                    <p className="text-fg-secondary text-sm mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step
                                    ? "bg-success-500 text-white"
                                    : i === step
                                        ? "bg-primary-600 text-white"
                                        : "bg-surface-muted text-fg-muted border border-border"
                                    }`}
                            >
                                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`hidden sm:inline text-xs font-medium ${i <= step ? "text-fg" : "text-fg-muted"}`}>
                                {s}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-px ${i < step ? "bg-success-500" : "bg-border"}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Step 0: Department Selection */}
                    {step === 0 && (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {departments.map((dept) => (
                                <button
                                    key={dept.id}
                                    onClick={() => updateField("department", dept.id)}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.department === dept.id
                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                        : "border-border hover:border-border-strong bg-surface"
                                        }`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                                        style={{ backgroundColor: dept.color }}
                                    >
                                        <dept.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-fg">{dept.label}</p>
                                        <p className="text-xs text-fg-secondary mt-0.5">{dept.desc}</p>
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
                                    <Input
                                        label="Complaint Title"
                                        placeholder="Brief title describing the issue"
                                        value={formData.title}
                                        onChange={(e) => updateField("title", e.target.value)}
                                        leftIcon={<FileText className="h-4 w-4" />}
                                        hint="Min 5 characters"
                                    />
                                    <Textarea
                                        label="Description"
                                        placeholder="Provide detailed description of the issue, including landmarks and reference points..."
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Priority"
                                            value={formData.priority}
                                            onChange={(e) => updateField("priority", e.target.value)}
                                            options={[
                                                { value: "low", label: "Low" },
                                                { value: "medium", label: "Medium" },
                                                { value: "high", label: "High" },
                                                { value: "critical", label: "Critical" },
                                            ]}
                                        />
                                        <Select
                                            label="Ward"
                                            value={formData.ward}
                                            onChange={(e) => updateField("ward", e.target.value)}
                                            options={[
                                                { value: "Ward 3", label: "Ward 3" },
                                                { value: "Ward 5", label: "Ward 5" },
                                                { value: "Ward 8", label: "Ward 8" },
                                                { value: "Ward 12", label: "Ward 12" },
                                                { value: "Ward 15", label: "Ward 15" },
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-fg mb-1.5">Attach Photos</label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                            <Upload className="h-8 w-8 text-fg-muted mx-auto mb-2" />
                                            <p className="text-sm text-fg-secondary">Click or drag photos here</p>
                                            <p className="text-xs text-fg-muted mt-1">PNG, JPG up to 5MB each</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Location */}
                    {step === 2 && (
                        <Card>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-xl bg-surface-muted border border-border flex items-center justify-center relative">
                                        <div className="text-center text-fg-muted">
                                            <MapPin className="h-10 w-10 mx-auto mb-2 text-primary-400" />
                                            <p className="text-sm font-medium">Interactive Map</p>
                                            <p className="text-xs mt-1">Click to pin complaint location</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDetectLocation}
                                        disabled={geoStatus === "requesting"}
                                        leftIcon={
                                            geoStatus === "requesting"
                                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                                : geoStatus === "success"
                                                    ? <CheckCircle className="h-4 w-4 text-success-500" />
                                                    : <Navigation className="h-4 w-4" />
                                        }
                                    >
                                        {geoStatus === "requesting" ? "Detecting..." : geoStatus === "success" ? "Location Detected" : "Detect My Location"}
                                    </Button>
                                    {geoStatus === "success" && (
                                        <p className="text-xs text-success-600 text-center">Ward auto-set to {formData.ward}</p>
                                    )}
                                    {(geoStatus === "denied" || geoStatus === "error" || geoStatus === "unavailable") && (
                                        <p className="text-xs text-warning-600 text-center">Location unavailable. Enter coordinates manually.</p>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Latitude"
                                            value={formData.lat}
                                            onChange={(e) => updateField("lat", e.target.value)}
                                        />
                                        <Input
                                            label="Longitude"
                                            value={formData.lng}
                                            onChange={(e) => updateField("lng", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <Card>
                            <CardContent>
                                <h3 className="text-lg font-semibold text-fg mb-4">Review Your Complaint</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Department", value: formData.department },
                                        { label: "Title", value: formData.title },
                                        { label: "Description", value: formData.description },
                                        { label: "Priority", value: formData.priority },
                                        { label: "Ward", value: formData.ward },
                                        { label: "Location", value: `${formData.lat}, ${formData.lng}` },
                                    ].map((item) => (
                                        <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
                                            <span className="text-sm font-medium text-fg-secondary w-32 shrink-0">{item.label}</span>
                                            <span className="text-sm text-fg capitalize">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 dark:bg-danger-500/10 text-sm border border-danger-500/20">
                    <AlertCircle className="h-4 w-4 text-danger-500 shrink-0" />
                    <span className="text-danger-600 dark:text-danger-400">{submitError}</span>
                </div>
            )}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 0}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                    Back
                </Button>
                {step < STEPS.length - 1 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        rightIcon={<CheckCircle className="h-4 w-4" />}
                    >
                        Submit Complaint
                    </Button>
                )}
            </div>
        </div>
    );
}
