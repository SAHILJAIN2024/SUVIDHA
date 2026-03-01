"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Globe,
    Search,
    AlertCircle,
    FileText,
    Clock,
    ChevronRight,
    SlidersHorizontal,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui";

/* ────────────────────────────────────────────────────
   Animation Variants
────────────────────────────────────────────────────── */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

/* ────────────────────────────────────────────────────
   Types & Style Maps
────────────────────────────────────────────────────── */
interface PublicComplaint {
    id: string;
    ticket_id: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    ward: string;
    created_at: string;
}

const statusStyles: Record<string, string> = {
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    escalated: "bg-purple-50 text-purple-700 border-purple-200",
};

const CATEGORIES = [
    "all", "street_light", "pothole", "broken_road", "drainage", "garbage", "water_leakage", "other",
];

/* ────────────────────────────────────────────────────
   Page Component
────────────────────────────────────────────────────── */
export default function PublicComplaintsPage() {
    const [complaints, setComplaints] = useState<PublicComplaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);
                setError(null);

                // ── 🔌 BACKEND: Replace with real endpoint when ready ──
                // const res = await fetch("/api/complaints/public");
                // const data = await res.json();
                // setComplaints(data.data || []);

                // ── 🎭 MOCK: Remove when backend is connected ──
                await new Promise((r) => setTimeout(r, 600));
                setComplaints([]);
            } catch {
                setError("Unable to load public complaints.");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const filtered = useMemo(() => {
        return complaints.filter((c) => {
            const matchSearch =
                c.subject.toLowerCase().includes(search.toLowerCase()) ||
                c.ticket_id.toLowerCase().includes(search.toLowerCase());
            const matchCat = categoryFilter === "all" || c.category === categoryFilter;
            return matchSearch && matchCat;
        });
    }, [complaints, search, categoryFilter]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-bg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
                    <div className="h-10 w-48 bg-surface rounded-xl animate-pulse" />
                    <div className="h-16 rounded-2xl bg-surface border border-border/40 animate-pulse" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-surface border border-border/40 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-danger-500" />
                    </div>
                    <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
                    <p className="text-sm text-fg-secondary mb-4">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    /* ── Main ── */
    return (
        <div className="min-h-screen bg-bg overflow-x-hidden">
            {/* Navbar */}
            <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-primary-500/30">
                                S
                            </div>
                            <span className="font-bold text-fg text-sm hidden sm:block">SUVIDHA</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/auth/login">
                            <Button variant="outline" size="sm" className="hover:bg-primary-50 hover:border-primary-200 transition-all">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="sm" className="shadow-sm hover:shadow-md transition-all">
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 relative"
            >
                {/* Blobs */}
                <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-primary-300/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-[250px] h-[250px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                {/* Header */}
                <motion.div variants={cardAnim} custom={0}>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-fg-secondary hover:text-fg mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                                Public <span className="text-primary-600">Complaints</span>
                            </h1>
                            <p className="text-fg-secondary mt-1 text-sm">
                                Community complaint feed — transparent civic governance in action.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                            <Globe className="h-3 w-3" />
                            Public Feed
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={cardAnim} custom={1}>
                    <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
                                <SlidersHorizontal className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-fg uppercase tracking-wider">Filters</span>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by subject or ticket ID…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-muted/50 border border-border/60 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
                                />
                            </div>
                            {/* Category */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-muted/50 border border-border/60 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c === "all" ? "All Categories" : c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Complaint List */}
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                    {filtered.map((c, i) => (
                        <motion.div key={c.id} variants={cardAnim} custom={i} whileHover={{ y: -2 }}>
                            <div className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-fg text-sm sm:text-base truncate">{c.subject}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-fg-muted">
                                            <span>#{c.ticket_id}</span>
                                            <span>•</span>
                                            <span className="capitalize">{c.category.replace("_", " ")}</span>
                                            <span>•</span>
                                            <span>{c.ward}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusStyles[c.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {c.status.replace("_", " ")}
                                        </span>
                                        <p className="text-xs text-fg-muted font-medium whitespace-nowrap inline-flex items-center">
                                            <Clock className="h-3 w-3 mr-1 inline" />
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filtered.length === 0 && !loading && (
                    <motion.div variants={cardAnim} custom={0} initial="hidden" animate="visible">
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                                <FileText className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-semibold text-fg mb-1">No public complaints yet</p>
                            <p className="text-sm text-fg-secondary max-w-xs mb-6">
                                {search || categoryFilter !== "all"
                                    ? "No results match your search or filter."
                                    : "Community complaints will appear here once submitted. Be the first to file one!"
                                }
                            </p>
                            <Link href="/auth/register">
                                <Button size="sm" className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                    Register & File a Complaint
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* CTA for non-logged-in users */}
                <motion.div variants={cardAnim} custom={filtered.length + 2}>
                    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <h2 className="text-lg sm:text-xl font-bold mb-2 relative z-10">
                            Have a civic issue to report?
                        </h2>
                        <p className="text-sm text-white/70 mb-4 relative z-10">
                            Register for a free account to file complaints, track status, and pay bills.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                            <Link href="/auth/register" className="w-full sm:w-auto">
                                <Button variant="secondary" size="sm" className="bg-white text-primary-700 hover:bg-white/90 w-full sm:w-auto">
                                    Register Free
                                </Button>
                            </Link>
                            <Link href="/auth/login" className="w-full sm:w-auto">
                                <Button variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
