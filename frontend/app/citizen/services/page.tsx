"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap, Droplets, Route, Recycle, FileText, CreditCard, Phone,
    HelpCircle, Plug, ShieldCheck, AlertCircle, ArrowRight,
    WifiOff, ChevronRight,
} from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

/* ────────────────────────────────────────────────────
   Animation Variants
────────────────────────────────────────────────────── */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

/* ────────────────────────────────────────────────────
   Static Service Data
────────────────────────────────────────────────────── */
const quickActions = [
    {
        icon: <FileText className="h-5 w-5" />,
        label: "File a Complaint",
        description: "Report a civic issue in your ward",
        href: "/citizen/complaints",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/25",
    },
    {
        icon: <CreditCard className="h-5 w-5" />,
        label: "Pay Bills",
        description: "Electricity, water, property tax & more",
        href: "/citizen/bills",
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/25",
    },
    {
        icon: <Plug className="h-5 w-5" />,
        label: "Request Connection",
        description: "Apply for new utility connection",
        href: "/citizen/services/request-connection",
        gradient: "from-violet-500 to-purple-600",
        shadow: "shadow-violet-500/25",
    },
    {
        icon: <ShieldCheck className="h-5 w-5" />,
        label: "Verify Documents",
        description: "Upload and verify your ID documents",
        href: "/citizen/documents",
        gradient: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/25",
    },
];

const departments = [
    {
        icon: <Zap className="h-5 w-5" />,
        name: "Electricity",
        description: "Power outages, billing issues, new connections",
        color: "text-amber-600 bg-amber-50",
        href: "/citizen/complaints?category=electricity",
    },
    {
        icon: <Droplets className="h-5 w-5" />,
        name: "Water Supply",
        description: "Water supply, drainage, leakages",
        color: "text-blue-600 bg-blue-50",
        href: "/citizen/complaints?category=water",
    },
    {
        icon: <Route className="h-5 w-5" />,
        name: "Roads & Transport",
        description: "Potholes, road damage, traffic signals",
        color: "text-violet-600 bg-violet-50",
        href: "/citizen/complaints?category=roads",
    },
    {
        icon: <Recycle className="h-5 w-5" />,
        name: "Sanitation",
        description: "Garbage collection, street cleaning",
        color: "text-emerald-600 bg-emerald-50",
        href: "/citizen/complaints?category=sanitation",
    },
];

const helpLinks = [
    { icon: <Phone className="h-4 w-4" />, label: "Call Helpline", sub: "1800-SUVIDHA (24×7)", href: "tel:1800748432" },
    { icon: <FileText className="h-4 w-4" />, label: "Service Guidelines", sub: "Download PDF guide", href: "#" },
    { icon: <HelpCircle className="h-4 w-4" />, label: "FAQs", sub: "Common questions answered", href: "#" },
];

/* ────────────────────────────────────────────────────
   Page Component
────────────────────────────────────────────────────── */
export default function ServicesPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate a brief load to check auth & fetch any dynamic service config
        // 🔌 BACKEND: swap with actual services fetch when available
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="space-y-8 p-4 sm:p-0">
                <div className="h-8 w-32 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-surface border border-border animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center mb-4">
                    <AlertCircle className="h-7 w-7 text-danger-500" />
                </div>
                <p className="text-fg font-semibold mb-1">Failed to load services</p>
                <p className="text-sm text-fg-secondary mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    /* ── Main ── */
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8 p-4 sm:p-0 relative"
        >
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0}>
                <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                    Civic <span className="text-primary-600">Services</span>
                </h1>
                <p className="text-fg-secondary mt-1 text-sm sm:text-base">
                    Browse and access all civic services and department portals
                </p>
            </motion.div>

            {/* ── Quick Actions Grid ── */}
            <motion.div variants={cardAnim} custom={1}>
                <h2 className="text-base font-bold text-fg mb-4 uppercase tracking-wider text-fg-secondary">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.div key={i} variants={cardAnim} custom={i + 2} whileHover={{ y: -4, scale: 1.01 }}>
                            <Link href={action.href}>
                                <div className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 h-full flex flex-col gap-3 cursor-pointer">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow}`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-fg text-sm">{action.label}</p>
                                        <p className="text-xs text-fg-secondary mt-0.5 leading-relaxed">{action.description}</p>
                                    </div>
                                    <div className="flex items-center text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Get Started <ArrowRight className="h-3 w-3 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── Bottom Row: Departments + Help ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Departments (spans 2 cols) */}
                <motion.div variants={cardAnim} custom={7} className="lg:col-span-2">
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-fg mb-5">
                                Department <span className="text-primary-600">Overview</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {departments.map((dept, i) => (
                                    <Link key={i} href={dept.href}>
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            className="group flex items-start gap-3 p-4 rounded-xl sm:rounded-2xl border border-border/40 hover:border-primary-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${dept.color}`}>
                                                {dept.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-fg text-sm">{dept.name}</p>
                                                <p className="text-xs text-fg-secondary mt-0.5 leading-relaxed line-clamp-2">{dept.description}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-fg-muted opacity-0 group-hover:opacity-100 group-hover:text-primary-600 transition-all flex-shrink-0 mt-0.5" />
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Help & Support */}
                <motion.div variants={cardAnim} custom={8}>
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-fg mb-5">
                                Help & <span className="text-primary-600">Support</span>
                            </h2>
                            <div className="space-y-3">
                                {helpLinks.map((item, i) => (
                                    <a key={i} href={item.href}>
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            className="group flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-fg text-sm">{item.label}</p>
                                                <p className="text-xs text-fg-secondary">{item.sub}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-fg-muted opacity-0 group-hover:opacity-100 group-hover:text-primary-600 transition-all flex-shrink-0" />
                                        </motion.div>
                                    </a>
                                ))}
                            </div>

                            {/* Request Connection CTA */}
                            <div className="mt-5 pt-5 border-t border-border/60">
                                <Link href="/citizen/services/request-connection">
                                    <Button
                                        className="w-full justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                        rightIcon={<ArrowRight className="h-4 w-4" />}
                                    >
                                        New Connection Request
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
