"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Calendar,
    Edit3,
    Camera,
    Hash,
    Flame,
    PhoneCall,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

/* ═══════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════ */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

interface Address {
    id: number;
    state: string;
    city: string;
    area: string;
    pin_code: string;
    ward: string;
}

interface Profile {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    adhaar_no: string;
    gas_no: string;
    ivrs_no: string;
    role: string;
    created_at: string;
    addresses: Address[];
}

export default function ProfilePage() {
    const { token } = useAuthStore();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    /* ---------------- FETCH PROFILE ---------------- */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("https://suvidha-qxz1.onrender.com/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!data.success) return;

                setProfile(data.user);
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    /* ---------------- UPDATE PROFILE ---------------- */
    const handleUpdate = async () => {
        if (!profile) return;

        try {
            const res = await fetch("https://suvidha-qxz1.onrender.com/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    dob: profile.dob,
                    gender: profile.gender,
                    gas_no: profile.gas_no,
                    ivrs_no: profile.ivrs_no,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setEditing(false);
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Profile not found.</div>;

    const primaryAddress = profile.addresses?.[0];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 overflow-hidden"
        >
            {/* ── Decorative Background Blobs ── */}
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0}>
                <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                    My <span className="text-primary-600">Profile</span>
                </h1>
                <p className="text-fg-secondary mt-1 text-sm">View and manage your personal information</p>
            </motion.div>

            {/* ── Profile Hero Card ── */}
            <motion.div variants={cardAnim} custom={1} whileHover={{ y: -4, scale: 1.01 }}>
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-6 sm:p-8">
                    {/* Inner decorative glow */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary-300/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg shadow-primary-500/30">
                                {profile.name.charAt(0)}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-fg-muted hover:border-primary-200 hover:text-primary-600 transition-all">
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-fg">{profile.name}</h2>
                            <p className="text-fg-secondary text-sm mt-0.5">{profile.email}</p>
                            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
                                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-primary-50 text-primary-700 border-primary-200 capitalize">
                                    {profile.role}
                                </span>
                                {profile.adhaar_no && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 inline-flex items-center gap-1.5">
                                        <Shield className="h-3 w-3" /> Verified
                                    </span>
                                )}
                            </div>
                        </div>
                        {editing ? (
                            <Button size="sm" onClick={handleUpdate} className="shrink-0">Save</Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Edit3 className="h-4 w-4" />}
                                onClick={() => setEditing(true)}
                                className="rounded-xl hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all shrink-0"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Personal Information ── */}
            <motion.div variants={cardAnim} custom={2}>
                <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                    {/* Header Strip */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
                            <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-fg">
                            Personal <span className="text-primary-600">Information</span>
                        </span>
                    </div>
                    <div className="p-5 sm:p-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={profile.name}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                leftIcon={<User className="h-4 w-4" />}
                            />
                            <Input label="Email" value={profile.email} readOnly leftIcon={<Mail className="h-4 w-4" />} />
                            <Input
                                label="Phone"
                                value={profile.phone || ""}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                leftIcon={<Phone className="h-4 w-4" />}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={profile.dob?.split("T")[0] || ""}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                leftIcon={<Calendar className="h-4 w-4" />}
                            />
                            <Input
                                label="Gender"
                                value={profile.gender || ""}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                            />
                            <Input
                                label="Member Since"
                                value={new Date(profile.created_at).toLocaleDateString()}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Address Details ── */}
            <motion.div variants={cardAnim} custom={3}>
                <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                    {/* Header Strip */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md shadow-violet-500/30">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-fg">
                            Address <span className="text-primary-600">Details</span>
                        </span>
                    </div>
                    <div className="p-5 sm:p-6">
                        {primaryAddress ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input label="State" value={primaryAddress.state} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                                <Input label="City" value={primaryAddress.city} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                                <Input label="Area" value={primaryAddress.area} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                                <Input label="PIN Code" value={primaryAddress.pin_code} readOnly leftIcon={<Hash className="h-4 w-4" />} />
                                <Input label="Ward" value={primaryAddress.ward} readOnly leftIcon={<MapPin className="h-4 w-4" />} />
                            </div>
                        ) : (
                            <p className="text-fg-muted text-sm">No address found.</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Identity & Linked Accounts ── */}
            <motion.div variants={cardAnim} custom={4}>
                <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                    {/* Header Strip */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                            <Shield className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-fg">
                            Identity & <span className="text-primary-600">Linked Accounts</span>
                        </span>
                    </div>
                    <div className="p-5 sm:p-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input
                                label="Aadhaar Number"
                                value={profile.adhaar_no || "Not linked"}
                                readOnly
                                leftIcon={<Shield className="h-4 w-4" />}
                            />
                            <Input
                                label="Gas Connection"
                                value={profile.gas_no || ""}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, gas_no: e.target.value })}
                                leftIcon={<Flame className="h-4 w-4" />}
                            />
                            <Input
                                label="IVRS Number"
                                value={profile.ivrs_no || ""}
                                readOnly={!editing}
                                onChange={(e) => setProfile({ ...profile, ivrs_no: e.target.value })}
                                leftIcon={<PhoneCall className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
