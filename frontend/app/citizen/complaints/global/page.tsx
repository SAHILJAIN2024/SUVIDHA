"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronUp,
  Zap,
  Droplets,
  Route,
  Recycle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Globe,
} from "lucide-react";

import { Card, CardContent, Button, Badge, StatusBadge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import { motion } from "framer-motion";

import { Complaint } from "@/types";

const ITEMS_PER_PAGE = 5;

const deptIcons: Record<string, React.ReactNode> = {
  electricity: <Zap className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
  roads: <Route className="h-4 w-4" />,
  sanitation: <Recycle className="h-4 w-4" />,
};

const cardAnim = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

export default function GlobalFeedPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [page, setPage] = useState(1);

  /* ------------------ DATA FETCH ------------------ */
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        // 🔌 BACKEND: replace with your actual public complaints endpoint
        // e.g. /api/complaints?scope=global  or  /api/complaints/public
        const res = await fetch("/api/complaints/public");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setComplaints(data.complaints ?? data ?? []);
      } catch (err: any) {
        console.error("[GlobalFeed] fetch error:", err);
        setError(err?.message || "Could not load public complaints.");
      } finally {
        setLoading(false);
      }
    };
    fetchGlobal();
  }, []);

  /* ------------------ VOTE ------------------ */
  const handleVote = async (id: string) => {
    // Optimistic update
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, votes: (c.votes ?? 0) + 1, hasVoted: true } : c
      )
    );
    try {
      // 🔌 BACKEND: POST to your vote endpoint
      // await fetch(`/api/complaints/${id}/vote`, { method: "POST" });
    } catch {
      // Revert on failure
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, votes: (c.votes ?? 1) - 1, hasVoted: false } : c
        )
      );
    }
  };

  /* ------------------ FILTER ------------------ */
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchDept = deptFilter === "all" || c.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [complaints, search, statusFilter, deptFilter]);

  useEffect(() => { setPage(1); }, [search, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* ------------------ LOADING ------------------ */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-52 rounded-xl bg-surface-muted animate-pulse border border-border/40" />
        <div className="h-16 rounded-2xl bg-surface-muted animate-pulse border border-border/40" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-surface-muted animate-pulse border border-border/40" />
        ))}
      </div>
    );
  }

  /* ------------------ ERROR ------------------ */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="text-lg font-semibold text-fg mb-1">Failed to load</p>
        <p className="text-sm text-fg-secondary mb-6 max-w-xs">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative space-y-8 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

      {/* Header */}
      <motion.div variants={cardAnim} custom={0}>
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          Global <span className="text-primary-600">Feed</span>
        </h1>
        <p className="text-fg-secondary mt-1 text-sm sm:text-base">
          Browse all civic complaints across wards — upvote issues that affect you.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={cardAnim} custom={1}>
        <Card className="rounded-2xl sm:rounded-3xl border border-border/60">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by title or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onChange={(e) => setDeptFilter(e.target.value)}
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
      </motion.div>

      {/* List */}
      <motion.div variants={stagger} className="space-y-3">
        {paginated.length === 0 ? (
          <motion.div variants={cardAnim} custom={0}>
            <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-4 shadow-sm">
                <Globe className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-fg mb-1">No complaints found</p>
              <p className="text-sm text-fg-secondary max-w-xs mx-auto">
                {search || statusFilter !== "all" || deptFilter !== "all"
                  ? "Try adjusting your filters."
                  : "No public complaints have been filed yet."}
              </p>
            </div>
          </motion.div>
        ) : (
          paginated.map((complaint, i) => (
            <motion.div key={complaint.id} variants={cardAnim} custom={i} whileHover={{ y: -2 }}>
              <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300">
                <CardContent className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {deptIcons[complaint.department] && (
                        <span className="text-fg-muted shrink-0">
                          {deptIcons[complaint.department]}
                        </span>
                      )}
                      <h3 className="font-bold text-fg text-sm sm:text-base truncate">
                        {complaint.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-fg-secondary line-clamp-1">
                      {complaint.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <StatusBadge status={complaint.status} size="sm" />
                      <Badge size="sm">{complaint.ward}</Badge>
                      <Badge size="sm" className="capitalize">{complaint.department}</Badge>
                    </div>
                  </div>

                  {/* Vote button */}
                  <button
                    onClick={() => !complaint.hasVoted && handleVote(complaint.id)}
                    disabled={complaint.hasVoted}
                    className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all duration-200 shrink-0 min-w-[44px] min-h-[44px] justify-center ${complaint.hasVoted
                        ? "bg-primary-50 border-primary-200 text-primary-600 cursor-default"
                        : "bg-surface-muted border-border/60 text-fg-muted hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 cursor-pointer"
                      }`}
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-xs font-bold leading-none">{complaint.votes ?? 0}</span>
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={cardAnim} custom={10} className="flex flex-wrap items-center gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
              className="min-w-[40px]"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
