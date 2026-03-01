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
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              {user?.name || user?.email?.split('@')[0]}
            </span>
          </h1>
          <p className="text-fg-secondary mt-1 text-sm bg-surface-muted inline-block px-2 py-0.5 rounded-md border border-border/40">
            {user?.email}
          </p>
          <p className="text-fg-secondary mt-2 text-sm sm:text-base">
            Here's an overview of your civic activity.
          </p>
        </div>
        <Link href="/citizen/complaints/new" className="shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            File New Complaint
          </Button>
        </Link>
      </div>

      {/* ── Stats Row ── FULL WIDTH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              {stat.value}
            </div>
            <p className="text-xs sm:text-sm text-fg-secondary font-semibold uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── My Complaints ── FULL WIDTH */}
      <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden shadow-sm">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 flex items-center justify-between bg-surface-muted/30">
          <h2 className="text-lg sm:text-xl font-bold text-fg">
            My <span className="text-primary-600">Complaints</span>
          </h2>
          <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8" onClick={() => router.push('/citizen/complaints')}>
            View All
          </Button>
        </div>

        <div className="divide-y divide-border/50">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-surface-muted animate-pulse border border-border/40" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-danger-500" />
              </div>
              <p className="text-sm font-semibold text-fg mb-1">Something went wrong</p>
              <p className="text-xs text-fg-secondary mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchDashboard}>Retry</Button>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <p className="text-base font-semibold text-fg mb-1">No complaints yet</p>
              <p className="text-sm text-fg-secondary">File your first complaint to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {complaints.slice(0, 5).map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => router.push(`/citizen/complaints/${complaint.id}`)}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 lg:p-6 hover:bg-surface-muted transition-colors cursor-pointer"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-fg text-sm sm:text-base group-hover:text-primary-600 transition-colors truncate">
                      {complaint.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-fg-muted font-medium">
                      <span className="bg-surface-sunken px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-fg-secondary border border-border/40">{complaint.ticket_id}</span>
                      <span>•</span>
                      <span>{complaint.category}</span>
                      {complaint.priority && (
                        <>
                          <span>•</span>
                          <span className={complaint.priority === 'High' ? 'text-danger-500 font-bold' : ''}>{complaint.priority}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 shrink-0 mt-2 md:mt-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1.5 uppercase tracking-wider ${statusStyles[complaint.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {complaint.status.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-fg-muted font-medium min-w-[80px] justify-end">
                      <Clock className="h-3 w-3" />
                      {new Date(complaint.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <ChevronRight className="h-4 w-4 text-fg-muted/50 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0 hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}