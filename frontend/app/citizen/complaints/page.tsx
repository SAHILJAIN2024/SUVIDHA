"use client";
import CreateComplaintForm from "@/components/newComplain";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  SlidersHorizontal,
  FileText,
  Clock,
} from "lucide-react";

import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";

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

/* ═══════════════════════════════════════════════════════════
   Style Maps
   ═══════════════════════════════════════════════════════════ */
const ITEMS_PER_PAGE = 5;

const statusStyles: Record<string, string> = {
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  escalated: "bg-purple-50 text-purple-700 border-purple-200",
};

interface Complaint {
  id: number;
  ticket_id: string;
  category: string;
  complaint_type: string;
  subject: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  created_at: string;
  authority_name?: string;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  const fetchComplaints = useCallback(async () => {
    try {
      if (!token) return;

      setLoading(true);
      setError(null);

      const res = await fetch("https://suvidha-qxz1.onrender.com/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("Backend returned failure");
      }

      setComplaints(data.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.ticket_id.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "all" || c.category === categoryFilter;

      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasActiveFilters = search !== "" || statusFilter !== "all" || categoryFilter !== "all";

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-surface-muted rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-20 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
        ))}
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="text-center py-20 p-4 md:p-6 lg:p-8">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-danger-500" />
        </div>
        <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
        <p className="text-sm text-fg-secondary mb-4">{error}</p>
        <Button variant="outline" size="sm" className="hover:bg-primary-50 hover:border-primary-200 transition-all" onClick={fetchComplaints}>Retry</Button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 p-4 md:p-6 lg:p-8 relative">
      {/* ── Decorative Background Blobs ── */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

      {/* ── Header ── */}
      <motion.div variants={cardAnim} custom={0} className="flex justify-between items-start gap-4 flex-wrap gap-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg">
            My <span className="text-primary-600">Complaints</span>
          </h1>
          <p className="text-fg-secondary text-sm mt-1">
            {complaints.length} complaint{complaints.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <CreateComplaintForm />
      </motion.div>

      {/* ── Filters ── */}
      <motion.div variants={cardAnim} custom={1}>
        <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden">
          {/* Filter Header Strip */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-surface/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-fg uppercase tracking-wider">Filters</span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search by subject or ticket ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "escalated", label: "Escalated" },
                ]}
              />

              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "street_light", label: "Street Light" },
                  { value: "pothole", label: "Pothole" },
                  { value: "broken_road", label: "Broken Road" },
                  { value: "drainage", label: "Drainage" },
                  { value: "garbage", label: "Garbage" },
                  { value: "water_leakage", label: "Water Leakage" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Complaint List ── */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        {paginated.map((complaint, i) => (
          <motion.div
            key={complaint.id}
            variants={cardAnim}
            custom={i}
            whileHover={{ y: -2 }}
          >
            <div
              className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 sm:p-6 cursor-pointer"
              onClick={() => router.push(`/citizen/complaints/${complaint.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Title + Meta */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-fg text-base truncate">{complaint.subject}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-fg-muted">
                    <span>#{complaint.ticket_id}</span>
                    <span>•</span>
                    <span>{complaint.category}</span>
                    {complaint.priority && (
                      <>
                        <span>•</span>
                        <span>{complaint.priority}</span>
                      </>
                    )}
                    {complaint.authority_name && (
                      <>
                        <span>•</span>
                        <span>Assigned: {complaint.authority_name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Status + Date */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusStyles[complaint.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {complaint.status.replace("_", " ")}
                  </span>
                  <p className="text-xs text-fg-muted font-medium whitespace-nowrap inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </p>
                  <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors hidden md:block" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Empty State ── */}
      {paginated.length === 0 && !loading && (
        <motion.div variants={cardAnim} custom={0} initial="hidden" animate="visible">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-fg mb-1">
              {hasActiveFilters ? "No matching complaints" : "No complaints yet"}
            </p>
            <p className="text-sm text-fg-secondary max-w-xs">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria."
                : "File your first complaint to get started."
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <motion.div variants={cardAnim} custom={paginated.length + 1} className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-all disabled:opacity-40"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "primary" : "outline"}
              size="sm"
              className={`rounded-xl min-w-[36px] transition-all ${page === i + 1
                ? "shadow-md shadow-primary-500/25"
                : "hover:bg-primary-50 hover:border-primary-200"
                }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-all disabled:opacity-40"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
