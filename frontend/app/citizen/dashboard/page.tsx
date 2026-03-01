"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════ */
const cardAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════════
   Status Badge Config
   ═══════════════════════════════════════════════════════════ */
const statusStyles: Record<string, string> = {
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

interface Complaint {
  id: number;
  ticket_id: string;
  subject: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
}

export default function UserDashboard() {
  const router = useRouter();

  const { user, token, isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !token) {
      router.replace("/auth/login");
      return;
    }

    if (user?.role !== "user") {
      router.replace(
        user?.role === "admin"
          ? "/admin/dashboard"
          : "/auth/login"
      );
      return;
    }

    fetchDashboard();
  }, [hasHydrated, isAuthenticated, user]);

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://suvidha-qxz1.onrender.com/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ---------------- STATS ---------------- */
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  /* ---------------- LOADING ---------------- */
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Initializing...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "user") {
    return null;
  }

  /* ═══════════════════════════════════════════════════════════
     Computed Stats
     ═══════════════════════════════════════════════════════════ */
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;

  const statsData = [
    { label: "Total Complaints", value: totalComplaints, icon: <FileText className="h-5 w-5" /> },
    { label: "Resolved", value: resolvedCount, icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Pending", value: pendingCount, icon: <AlertCircle className="h-5 w-5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden space-y-8"
    >
      {/* ── Decorative Background Blobs ── */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
      <div className="space-y-8">

        {/* ── Page Header ── */}
        <motion.div variants={cardAnim} custom={0} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-fg">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                {user?.email}
              </span>
            </h1>
            <p className="text-fg-secondary mt-1 text-base">
              Here&apos;s an overview of your civic activity.
            </p>
          </div>
          <Link href="/citizen/complaints/new" className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              File New Complaint
            </Button>
          </Link>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={cardAnim}
              custom={i + 1}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl sm:rounded-3xl bg-bg shadow-sm border border-border/40 hover:border-primary-500/30 transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-fg-secondary font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Complaints Card ── */}
        <motion.div variants={cardAnim} custom={4} initial="hidden" animate="visible">
          <div className="bg-surface p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300">

            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-fg">
                My <span className="text-primary-600">Complaints</span>
              </h2>
            </div>

            {/* Content */}
            {loading ? (
              /* Skeleton Loader */
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-surface-muted animate-pulse border border-border/40" />
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-danger-500" />
                </div>
                <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
                <p className="text-sm text-fg-secondary mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchDashboard}>Retry</Button>
              </div>
            ) : complaints.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold text-fg mb-1">No complaints yet</p>
                <p className="text-sm text-fg-secondary">File your first complaint to get started.</p>
              </div>
            ) : (
              /* Complaint Rows */
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                {complaints.slice(0, 5).map((complaint, i) => (
                  <motion.div
                    key={complaint.id}
                    variants={cardAnim}
                    custom={i}
                    whileHover={{ y: -2 }}
                  >
                    <div
                      className="group border border-border/60 p-5 sm:p-6 rounded-2xl hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-0.5 hover:border-primary-200 transition-all duration-300 bg-bg flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      onClick={() => router.push(`/citizen/complaints/${complaint.id}`)}
                    >
                      {/* Title + Meta */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-fg text-base truncate">{complaint.subject}</h3>
                        <div className="flex gap-2 mt-1.5 flex-wrap text-xs text-fg-muted">
                          <span>#{complaint.ticket_id}</span>
                          <span>•</span>
                          <span>{complaint.category}</span>
                          {complaint.priority && (
                            <>
                              <span>•</span>
                              <span>{complaint.priority}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Status + Date + Arrow */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusStyles[complaint.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {complaint.status.replace("_", " ")}
                        </span>

                        <p className="text-xs text-fg-muted font-medium whitespace-nowrap inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1 inline" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </p>

                        <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors shrink-0 hidden md:block" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}