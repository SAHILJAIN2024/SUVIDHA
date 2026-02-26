"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Search,
    ChevronUp,
    ChevronDown,
    MessageSquare,
    Zap,
    Droplets,
    Route,
    Recycle,
    TrendingUp,
    Filter,
    Clock,
    MapPin,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Input, Select } from "@/components/ui";
import { getComplaints, voteComplaint } from "@/services/complaint.service";
import { Complaint } from "@/types";
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

// Mock comments count per complaint
const mockComments: Record<string, number> = {
    "CMP-2025-001": 5,
    "CMP-2025-002": 12,
    "CMP-2025-003": 8,
    "CMP-2025-004": 3,
    "CMP-2025-005": 1,
    "CMP-2025-006": 2,
};

export default function GlobalComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
    const [deptFilter, setDeptFilter] = useState("all");

    useEffect(() => {
        getComplaints()
            .then((data) => { setComplaints(data); setLoading(false); })
            .catch(() => { setError("Failed to load complaints"); setLoading(false); });
    }, []);

    const handleVote = async (id: string, direction: "up" | "down") => {
        if (direction === "up") {
            const updated = await voteComplaint(id);
            if (updated) {
                setComplaints((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, votes: updated.votes, hasVoted: true } : c))
                );
            }
        } else {
            setComplaints((prev) =>
                prev.map((c) => (c.id === id ? { ...c, votes: Math.max(0, c.votes - 1), hasVoted: true } : c))
            );
        }
    };

    const filtered = complaints
        .filter((c) => {
            const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
            const matchDept = deptFilter === "all" || c.department === deptFilter;
            return matchSearch && matchDept;
        })
        .sort((a, b) => (sortBy === "votes" ? b.votes - a.votes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-surface border border-border animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-fg">Global Complaints Feed</h1>
                <p className="text-fg-secondary mt-1">
                    Public complaints from all citizens — vote, discuss, and track
                </p>
            </div>

            {/* Filters */}
            <Card padding="sm">
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
                        <Select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            options={[
                                { value: "all", label: "All Departments" },
                                { value: "electricity", label: "Electricity" },
                                { value: "water", label: "Water" },
                                { value: "roads", label: "Roads" },
                                { value: "sanitation", label: "Sanitation" },
                            ]}
                        />
                        <div className="flex gap-1 p-1 bg-surface-muted rounded-lg">
                            <button
                                onClick={() => setSortBy("votes")}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === "votes" ? "bg-surface shadow-sm text-fg" : "text-fg-secondary"}`}
                            >
                                <TrendingUp className="h-3 w-3 inline mr-1" /> Top
                            </button>
                            <button
                                onClick={() => setSortBy("recent")}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === "recent" ? "bg-surface shadow-sm text-fg" : "text-fg-secondary"}`}
                            >
                                <Clock className="h-3 w-3 inline mr-1" /> New
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reddit-style Complaints Feed */}
            <div className="space-y-3">
                {filtered.map((complaint, i) => (
                    <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                    >
                        <Card className="hover:shadow-md transition-all">
                            <CardContent>
                                <div className="flex gap-3">
                                    {/* Reddit-style Vote Column */}
                                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                                        <button
                                            onClick={() => handleVote(complaint.id, "up")}
                                            disabled={complaint.hasVoted}
                                            className={`p-1 rounded transition-colors ${complaint.hasVoted ? "text-primary-600" : "text-fg-muted hover:text-primary-600 hover:bg-primary-50 cursor-pointer"}`}
                                        >
                                            <ChevronUp className="h-5 w-5" />
                                        </button>
                                        <span className="text-sm font-bold text-fg">{complaint.votes}</span>
                                        <button
                                            onClick={() => handleVote(complaint.id, "down")}
                                            disabled={complaint.hasVoted}
                                            className={`p-1 rounded transition-colors ${complaint.hasVoted ? "text-fg-muted" : "text-fg-muted hover:text-danger-500 hover:bg-danger-50 cursor-pointer"}`}
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Meta */}
                                        <div className="flex items-center gap-2 text-xs text-fg-muted mb-1">
                                            <span className="flex items-center gap-1" style={{ color: deptColors[complaint.department] }}>
                                                {deptIcons[complaint.department]}
                                                <span className="capitalize">{complaint.department}</span>
                                            </span>
                                            <span>•</span>
                                            <span>{complaint.ward}</span>
                                            <span>•</span>
                                            <span>by {complaint.citizenName}</span>
                                            <span>•</span>
                                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {/* Title */}
                                        <Link href={`/citizen/complaints/${complaint.id}`}>
                                            <h3 className="text-sm font-semibold text-fg hover:text-primary-600 transition-colors cursor-pointer">
                                                {complaint.title}
                                            </h3>
                                        </Link>

                                        {/* Description */}
                                        <p className="text-xs text-fg-secondary mt-1 line-clamp-2">{complaint.description}</p>

                                        {/* Footer */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <StatusBadge status={complaint.status} size="sm" />
                                            <Badge variant={complaint.priority === "critical" ? "danger" : complaint.priority === "high" ? "warning" : "default"} size="sm">
                                                {complaint.priority}
                                            </Badge>
                                            <Link href={`/citizen/complaints/${complaint.id}`} className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors">
                                                <MessageSquare className="h-3 w-3" />
                                                {mockComments[complaint.id] || 0} comments
                                            </Link>
                                            {complaint.assignedTo && (
                                                <span className="text-xs text-fg-muted">
                                                    → Assigned: {complaint.assignedTo}
                                                </span>
                                            )}

                                            {/* Escalation indicator */}
                                            {complaint.status === "escalated" && (
                                                <Badge variant="accent" size="sm">⚡ Auto-escalated</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
