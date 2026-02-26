"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowUp, ArrowDown, Search, Filter, MessageCircle, Clock,
    MapPin, ChevronRight, ArrowLeft, Shield, TrendingUp, AlertCircle,
} from "lucide-react";
import { Button, Card, CardContent, Badge, StatusBadge, Input } from "@/components/ui";
import { Complaint, Department } from "@/types";
import { getComplaints, voteComplaint } from "@/services/complaint.service";
import { useGSAP } from "@/hooks/useGSAP";

const deptLabels: Record<Department, string> = {
    electricity: "Electricity",
    water: "Water Supply",
    roads: "Roads",
    sanitation: "Sanitation",
};

const deptColors: Record<Department, string> = {
    electricity: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    water: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    roads: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    sanitation: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function PublicComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState<"all" | Department>("all");
    const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");

    useEffect(() => {
        getComplaints()
            .then((data) => { setComplaints(data); setLoading(false); })
            .catch(() => { setError("Failed to load complaints"); setLoading(false); });
    }, []);

    const handleVote = async (id: string, dir: "up" | "down") => {
        await voteComplaint(id);
        setComplaints((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, votes: c.votes + (dir === "up" ? 1 : -1), hasVoted: true } : c
            )
        );
    };

    const filtered = complaints
        .filter((c) => {
            const matchesDept = deptFilter === "all" || c.department === deptFilter;
            const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
            return matchesDept && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "votes") return b.votes - a.votes;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", { y: 14, stagger: 0.04 });

    return (
        <div ref={gsapRef} className="min-h-screen bg-bg">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm">S</div>
                            <span className="font-bold text-fg hidden sm:inline">SUVIDHA</span>
                        </Link>
                        <div className="h-6 w-px bg-border" />
                        <h1 className="text-sm font-semibold text-fg">Public Complaints</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/auth/login">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="sm">Register</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Banner */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-2">Community Complaints Feed</h2>
                    <p className="text-fg-secondary">View live complaint statuses, assigned authorities, and vote for issues that matter to your community.</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search complaints..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<Search className="h-4 w-4" />}
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <select
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value as "all" | Department)}
                                    className="h-10 px-3 bg-surface border border-border rounded-lg text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                >
                                    <option value="all">All Departments</option>
                                    <option value="electricity">Electricity</option>
                                    <option value="water">Water Supply</option>
                                    <option value="roads">Roads</option>
                                    <option value="sanitation">Sanitation</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "votes" | "newest")}
                                    className="h-10 px-3 bg-surface border border-border rounded-lg text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                >
                                    <option value="votes">Most Voted</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feed */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-surface border border-border animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                        <p className="text-fg-secondary">{error}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((complaint, i) => (
                            <motion.div
                                key={complaint.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent>
                                        <div className="flex gap-4">
                                            {/* Vote column */}
                                            <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                                                <button
                                                    onClick={() => handleVote(complaint.id, "up")}
                                                    className="p-1 rounded hover:bg-success-50 text-fg-muted hover:text-success-500 transition-colors"
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </button>
                                                <span className="text-sm font-bold text-fg">{complaint.votes}</span>
                                                <button
                                                    onClick={() => handleVote(complaint.id, "down")}
                                                    className="p-1 rounded hover:bg-danger-50 text-fg-muted hover:text-danger-500 transition-colors"
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deptColors[complaint.department]}`}>
                                                        {deptLabels[complaint.department]}
                                                    </span>
                                                    <StatusBadge status={complaint.status} size="sm" />
                                                    {complaint.priority === "critical" && (
                                                        <Badge variant="danger" size="sm">Critical</Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-semibold text-fg mb-1">{complaint.title}</h3>
                                                <p className="text-sm text-fg-secondary line-clamp-2">{complaint.description}</p>
                                                <div className="flex items-center gap-3 mt-3 text-xs text-fg-muted flex-wrap">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {complaint.ward}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                    <span>by {complaint.citizenName}</span>
                                                    {complaint.assignedTo && (
                                                        <span className="text-primary-600">→ Assigned: {complaint.assignedTo}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-16">
                                <Search className="h-10 w-10 text-fg-muted mx-auto mb-3" />
                                <p className="text-fg-secondary">No complaints found matching your filters</p>
                            </div>
                        )}
                    </div>
                )}

                {/* CTA for unauthenticated users */}
                <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border border-primary-200 dark:border-primary-800 text-center">
                    <Shield className="h-10 w-10 text-primary-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-fg mb-2">Want to file a complaint?</h3>
                    <p className="text-fg-secondary max-w-md mx-auto mb-6">
                        Register for a free SUVIDHA account to file complaints, track resolutions, pay bills, and more.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/auth/register"><Button rightIcon={<ChevronRight className="h-4 w-4" />}>Create Account</Button></Link>
                        <Link href="/auth/login"><Button variant="outline">Sign In</Button></Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
