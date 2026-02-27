"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText,
    Plus,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Zap,
    Droplets,
    Route,
    Recycle,
    AlertCircle as AlertCircleIcon,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { getComplaints } from "@/services/complaint.service";
import { getBills } from "@/services/bill.service";
import { Complaint, Bill } from "@/types";

import { useI18nStore } from "@/store/i18n.store";

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4" />,
    water: <Droplets className="h-4 w-4" />,
    roads: <Route className="h-4 w-4" />,
    sanitation: <Recycle className="h-4 w-4" />,
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function CitizenDashboard() {
    const { user } = useAuthStore();
    const { t } = useI18nStore();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [c, b] = await Promise.all([getComplaints(), getBills()]);
                setComplaints(c);
                setBills(b);
            } catch {
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const pendingCount = complaints.filter((c) => c.status === "pending").length;
    const inProgressCount = complaints.filter((c) => c.status === "in-progress").length;
    const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
    const unpaidBills = bills.filter((b) => b.status !== "paid");
    const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    const summaryCards = [
        { label: t("dashboard.totalComplaints"), value: complaints.length, icon: FileText, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
        { label: t("complaints.status.pending"), value: pendingCount, icon: Clock, color: "text-warning-500", bg: "bg-warning-50 dark:bg-warning-500/10" },
        { label: t("complaints.status.inProgress"), value: inProgressCount, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: t("complaints.status.resolved"), value: resolvedCount, icon: CheckCircle, color: "text-success-500", bg: "bg-success-50 dark:bg-success-500/10" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

    if (error) {
        return (
            <div className="text-center py-16">
                <AlertCircleIcon className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-fg">
                    {t("dashboard.welcome")}, {user?.name?.split(" ")[0] || "Citizen"} 👋
                </h1>
                <p className="text-fg-secondary mt-1">
                    {t("dashboard.overview")}
                </p>
            </div>

            {/* Summary Cards — 2x2 grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <motion.div key={i} variants={cardAnim} custom={i}>
                        <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <CardContent>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-fg-secondary">{card.label}</p>
                                        <p className="text-3xl font-bold text-fg mt-1">{card.value}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div variants={cardAnim} custom={4} className="flex flex-wrap gap-3">
                <Link href="/citizen/complaints/new">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        {t("complaints.fileNew")}
                    </Button>
                </Link>
                <Link href="/citizen/bills">
                    <Button variant="outline" leftIcon={<CreditCard className="h-4 w-4" />}>
                        {t("bills.payBills")} ({unpaidBills.length})
                    </Button>
                </Link>
            </motion.div>

            {/* ── Main Content: 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Recent Complaints */}
                <motion.div variants={cardAnim} custom={5}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-fg">{t("dashboard.recentComplaints")}</h2>
                                <Link href="/citizen/complaints">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                        {t("common.viewAll")}
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {complaints.slice(0, 4).map((complaint) => (
                                    <Link key={complaint.id} href={`/citizen/complaints/${complaint.id}`}>
                                        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-muted transition-colors group cursor-pointer">
                                            <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center text-fg-secondary shrink-0 mt-0.5">
                                                {deptIcons[complaint.department]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-fg truncate group-hover:text-primary-600 transition-colors">
                                                        {complaint.title}
                                                    </p>
                                                    <ArrowUpRight className="h-3 w-3 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={complaint.status} size="sm" />
                                                    <span className="text-xs text-fg-muted">{complaint.id}</span>
                                                    <span className="text-xs text-fg-muted">• {complaint.ward}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" size="sm">{complaint.votes} votes</Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Bills Summary */}
                <motion.div variants={cardAnim} custom={6}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-fg">{t("bills.billsDue")}</h2>
                                <Link href="/citizen/bills">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                        {t("bills.allBills")}
                                    </Button>
                                </Link>
                            </div>

                            {/* Total Due */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-900/10 mb-4">
                                <p className="text-sm text-accent-700 dark:text-accent-400">{t("bills.totalDue")}</p>
                                <p className="text-2xl font-bold text-accent-700 dark:text-accent-300 mt-0.5">
                                    ₹{totalDue.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {unpaidBills.slice(0, 3).map((bill) => (
                                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-muted hover:bg-surface-muted/70 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-fg capitalize">{bill.type.replace("-", " ")}</p>
                                            <p className="text-xs text-fg-muted">{bill.period} • Due {bill.dueDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-fg">₹{bill.amount.toLocaleString()}</p>
                                            {bill.status === "overdue" && (
                                                <Badge variant="danger" size="sm">
                                                    <AlertCircle className="h-3 w-3" /> Overdue
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
