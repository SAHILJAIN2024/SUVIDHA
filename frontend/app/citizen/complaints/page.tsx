"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    ChevronUp,
    ArrowUpRight,
    Zap,
    Droplets,
    Route,
    Recycle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import { getComplaints, voteComplaint } from "@/services/complaint.service";
import { Complaint, ComplaintStatus, Department } from "@/types";
import { AlertCircle } from "lucide-react";

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4" />,
    water: <Droplets className="h-4 w-4" />,
    roads: <Route className="h-4 w-4" />,
    sanitation: <Recycle className="h-4 w-4" />,
};

const deptColors: Record<string, string> = {
    electricity: "#F59E0B",
    water: "#3B82F6",
    roads: "#8B5CF6",
    sanitation: "#10B981",
};

const ITEMS_PER_PAGE = 5;

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deptFilter, setDeptFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        getComplaints()
            .then((data) => { setComplaints(data); setLoading(false); })
            .catch(() => { setError("Failed to load complaints"); setLoading(false); });
    }, []);

    const handleVote = async (id: string) => {
        const updated = await voteComplaint(id);
        if (updated) {
            setComplaints((prev) =>
                prev.map((c) => (c.id === id ? { ...c, votes: updated.votes, hasVoted: true } : c))
            );
        }
    };

    const filtered = complaints.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        const matchDept = deptFilter === "all" || c.department === deptFilter;
        return matchSearch && matchStatus && matchDept;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />
                ))}
            </div>
        );
    }

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-fg">My Complaints</h1>
                    <p className="text-fg-secondary mt-1">{complaints.length} complaints total</p>
                </div>
                <Link href="/citizen/complaints/new">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>New Complaint</Button>
                </Link>
            </div>

            {/* Filters */}
            <Card padding="sm">
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Search complaints..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "pending", label: "Pending" },
                                { value: "in-progress", label: "In Progress" },
                                { value: "resolved", label: "Resolved" },
                                { value: "rejected", label: "Rejected" },
                                { value: "escalated", label: "Escalated" },
                            ]}
                        />
                        <Select
                            value={deptFilter}
                            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                            options={[
                                { value: "all", label: "All Departments" },
                                { value: "electricity", label: "Electricity" },
                                { value: "water", label: "Water" },
                                { value: "roads", label: "Roads" },
                                { value: "sanitation", label: "Sanitation" },
                            ]}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Complaint List */}
            <div className="space-y-3">
                {paginated.map((complaint, i) => (
                    <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="hover:shadow-md transition-all group">
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    {/* Dept Icon */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5"
                                        style={{ backgroundColor: deptColors[complaint.department] }}
                                    >
                                        {deptIcons[complaint.department]}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <Link href={`/citizen/complaints/${complaint.id}`}>
                                                    <h3 className="text-sm font-semibold text-fg group-hover:text-primary-600 transition-colors truncate">
                                                        {complaint.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">{complaint.description}</p>
                                            </div>
                                            <Link href={`/citizen/complaints/${complaint.id}`}>
                                                <ArrowUpRight className="h-4 w-4 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                                            </Link>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <StatusBadge status={complaint.status} size="sm" />
                                            <Badge variant="outline" size="sm">{complaint.id}</Badge>
                                            <Badge variant="outline" size="sm">{complaint.ward}</Badge>
                                            <Badge variant={complaint.priority === "critical" ? "danger" : complaint.priority === "high" ? "warning" : "default"} size="sm">
                                                {complaint.priority}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Vote */}
                                    <button
                                        onClick={() => !complaint.hasVoted && handleVote(complaint.id)}
                                        disabled={complaint.hasVoted}
                                        className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all shrink-0 ${complaint.hasVoted
                                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                                            : "bg-surface-muted text-fg-secondary hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
                                            }`}
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                        <span className="text-xs font-bold">{complaint.votes}</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-fg-muted">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button key={i} variant={page === i + 1 ? "primary" : "ghost"} size="sm" onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </Button>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
