"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Zap, Droplets, Route, Recycle, ArrowUpRight, ChevronUp, AlertCircle } from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Input, Select } from "@/components/ui";
import { getComplaints } from "@/services/complaint.service";
import { Complaint, Department } from "@/types";
import { useAuthStore } from "@/store/auth.store";

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4" />,
    water: <Droplets className="h-4 w-4" />,
    roads: <Route className="h-4 w-4" />,
    sanitation: <Recycle className="h-4 w-4" />,
};

// Map admin roles to their department
const roleToDept: Record<string, Department | null> = {
    "admin-electricity": "electricity",
    "admin-water": "water",
    "admin-roads": "roads",
    "admin-sanitation": "sanitation",
    "super-admin": null, // null = all departments
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function AdminComplaintsPage() {
    const { user } = useAuthStore();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Determine which department this admin manages
    const adminDept = user?.role ? roleToDept[user.role] ?? null : null;

    useEffect(() => {
        getComplaints()
            .then((data) => { setComplaints(data); setLoading(false); })
            .catch(() => { setError("Failed to load complaints"); setLoading(false); });
    }, []);


    const filtered = complaints.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        const matchDept = adminDept ? c.department === adminDept : true;
        return matchSearch && matchStatus && matchDept;
    });

    if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-surface border border-border animate-pulse" />)}</div>;

    if (error) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" className="space-y-6">
            <h1 className="text-2xl font-bold text-fg">All Complaints</h1>

            {/* ── 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Search & Filters */}
                <motion.div variants={cardAnim} custom={0}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Search & Filters</h2>
                            <div className="space-y-3">
                                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
                                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[
                                    { value: "all", label: "All" },
                                    { value: "pending", label: "Pending" },
                                    { value: "in-progress", label: "In Progress" },
                                    { value: "resolved", label: "Resolved" },
                                    { value: "rejected", label: "Rejected" },
                                    { value: "escalated", label: "Escalated" },
                                ]} />
                            </div>
                            <div className="mt-4 p-3 rounded-xl bg-surface-muted">
                                <p className="text-sm text-fg-secondary"><span className="font-semibold text-fg">{filtered.length}</span> complaints found</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Summary Stats */}
                <motion.div variants={cardAnim} custom={1}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Overview</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Total", value: complaints.length, color: "text-primary-600" },
                                    { label: "Pending", value: complaints.filter(c => c.status === "pending").length, color: "text-warning-500" },
                                    { label: "In Progress", value: complaints.filter(c => c.status === "in-progress").length, color: "text-blue-500" },
                                    { label: "Resolved", value: complaints.filter(c => c.status === "resolved").length, color: "text-success-500" },
                                ].map((s) => (
                                    <div key={s.label} className="p-3 rounded-xl bg-surface-muted text-center hover:bg-surface-muted/70 transition-colors">
                                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-fg-muted mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Full-width Table Card */}
            <motion.div variants={cardAnim} custom={2}>
                <Card padding="none" className="hover:shadow-lg transition-shadow duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface-muted/50">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Title</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider hidden sm:table-cell">Dept</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider hidden md:table-cell">Votes</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-muted/30 transition-colors">
                                        <td className="py-3 px-4"><Badge variant="outline" size="sm">{c.id}</Badge></td>
                                        <td className="py-3 px-4">
                                            <Link href={`/citizen/complaints/${c.id}`} className="font-medium text-fg hover:text-primary-600 transition-colors truncate max-w-[200px] block">
                                                {c.title}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 hidden sm:table-cell"><span className="flex items-center gap-1.5 text-fg-secondary capitalize">{deptIcons[c.department]} {c.department}</span></td>
                                        <td className="py-3 px-4"><StatusBadge status={c.status} size="sm" /></td>
                                        <td className="py-3 px-4 hidden md:table-cell"><span className="flex items-center gap-1 text-fg-secondary"><ChevronUp className="h-3 w-3" />{c.votes}</span></td>
                                        <td className="py-3 px-4 hidden lg:table-cell text-fg-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
