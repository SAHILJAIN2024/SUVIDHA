"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    User, Mail, Phone, MapPin, Shield, Calendar, Edit3, Camera,
    Hash, Flame, PhoneCall, Zap, Droplets, Building,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
    const { user } = useAuthStore();
    const displayUser = user || {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12",
        role: "citizen",
        aadhaarVerified: true,
        createdAt: "2025-06-15T10:00:00Z",
        dob: "1990-05-15",
        gender: "male" as const,
        state: "Assam",
        city: "Silchar",
        area: "Tarapur",
        pinCode: "788001",
        aadhaarNo: "XXXX-XXXX-4321",
        gasNo: "GAS-91234",
        ivrsNo: "IVRS-7821",
        electricityAccountNo: "ELEC-78234",
        waterAccountNo: "WTR-45123",
        propertyTaxId: "PT-334521",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
        >
            <h1 className="text-2xl font-bold text-fg">My Profile</h1>

            {/* Profile Card */}
            <Card>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {displayUser.name.charAt(0)}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-surface border-2 border-border flex items-center justify-center text-fg-muted hover:text-fg transition-colors">
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl font-bold text-fg">{displayUser.name}</h2>
                            <p className="text-fg-secondary text-sm">{displayUser.email}</p>
                            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                                <Badge variant="primary" size="sm" className="capitalize">{displayUser.role}</Badge>
                                {displayUser.aadhaarVerified && (
                                    <Badge variant="success" size="sm"><Shield className="h-3 w-3" /> Verified</Badge>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" size="sm" leftIcon={<Edit3 className="h-4 w-4" />}>
                            Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold text-fg mb-4">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Full Name" value={displayUser.name} readOnly leftIcon={<User className="h-4 w-4" />} />
                        <Input label="Email" value={displayUser.email} readOnly leftIcon={<Mail className="h-4 w-4" />} />
                        <Input label="Phone" value={displayUser.phone} readOnly leftIcon={<Phone className="h-4 w-4" />} />
                        <Input label="Date of Birth" value={displayUser.dob ? new Date(displayUser.dob).toLocaleDateString() : "—"} readOnly leftIcon={<Calendar className="h-4 w-4" />} />
                        <Input label="Gender" value={displayUser.gender ? displayUser.gender.charAt(0).toUpperCase() + displayUser.gender.slice(1) : "—"} readOnly leftIcon={<User className="h-4 w-4" />} />
                        <Input label="Member Since" value={new Date(displayUser.createdAt).toLocaleDateString()} readOnly leftIcon={<Calendar className="h-4 w-4" />} />
                    </div>
                </CardContent>
            </Card>

            {/* Address Details */}
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold text-fg mb-4">Address Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="State" value={displayUser.state || "—"} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                        <Input label="City" value={displayUser.city || "—"} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                        <Input label="Area / Locality" value={displayUser.area || "—"} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                        <Input label="PIN Code" value={displayUser.pinCode || "—"} readOnly leftIcon={<Hash className="h-4 w-4" />} />
                        <Input label="Ward" value={displayUser.ward} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                    </div>
                </CardContent>
            </Card>

            {/* Identity & Linked Accounts */}
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold text-fg mb-4">Identity & Linked Accounts</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Aadhaar Number" value={displayUser.aadhaarNo || "Not linked"} readOnly leftIcon={<Shield className="h-4 w-4" />} />
                        <Input label="Gas Connection No." value={displayUser.gasNo || "Not linked"} readOnly leftIcon={<Flame className="h-4 w-4" />} />
                        <Input label="IVRS Number" value={displayUser.ivrsNo || "Not linked"} readOnly leftIcon={<PhoneCall className="h-4 w-4" />} />
                        <Input label="Electricity Account" value={displayUser.electricityAccountNo || "Not linked"} readOnly leftIcon={<Zap className="h-4 w-4" />} />
                        <Input label="Water Account" value={displayUser.waterAccountNo || "Not linked"} readOnly leftIcon={<Droplets className="h-4 w-4" />} />
                        <Input label="Property Tax ID" value={displayUser.propertyTaxId || "Not linked"} readOnly leftIcon={<Building className="h-4 w-4" />} />
                    </div>
                </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold text-fg mb-4">Activity Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Complaints Filed", value: "6" },
                            { label: "Resolved", value: "1" },
                            { label: "Bills Paid", value: "2" },
                            { label: "Upvotes Given", value: "12" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-4 rounded-xl bg-surface-muted">
                                <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                                <p className="text-xs text-fg-secondary mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
