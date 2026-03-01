'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ListFilter,
  ArrowRight,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useI18nStore } from "@/store/i18n.store";

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
   Types & Style Maps
   ═══════════════════════════════════════════════════════════ */
interface QueueItem {
  _id: string;
  title: string;
  status: string;       // pending | in_progress | resolved | rejected
  priority: string;     // low | medium | high | critical
  department: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const priorityStyles: Record<string, string> = {
  low: "bg-slate-50 text-slate-600 border-slate-200",
  medium: "bg-sky-50 text-sky-700 border-sky-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18nStore();

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);

      // ── 🔌 BACKEND: Uncomment these 3 lines when your API is ready ──
      // const res = await fetch("http://localhost:5000/api/admin/queue", {
      //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Failed to load queue");
      // setQueue(data.queue || []);

      // ── 🎭 MOCK: Remove this block when backend is connected ──
      await new Promise((r) => setTimeout(r, 800));
      setQueue([]); // empty state for now

    } catch (err: any) {
      console.error("Queue load error:", err);
      setError(err.message || "Failed to load action queue");
    } finally {
      setLoading(false);
    }
  };

  /* ── Computed Stats (only visible when queue has items) ── */
  const totalCount = queue.length;
  const pendingCount = queue.filter((q) => q.status === "pending").length;
  const inProgressCount = queue.filter((q) => q.status === "in_progress").length;
  const resolvedCount = queue.filter((q) => q.status === "resolved").length;

  const statsData = [
    { label: "Total", value: totalCount, icon: <FileText className="h-5 w-5" /> },
    { label: "Pending", value: pendingCount, icon: <Clock className="h-5 w-5" /> },
    { label: "In Progress", value: inProgressCount, icon: <Loader2 className="h-5 w-5" /> },
    { label: "Resolved", value: resolvedCount, icon: <CheckCircle className="h-5 w-5" /> },
  ];

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="h-9 w-48 bg-surface-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface border border-border/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="text-center py-20 p-4 md:p-6 lg:p-8">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-danger-500" />
        </div>
        <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
        <p className="text-sm text-fg-secondary mb-4">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary-50 hover:border-primary-200 transition-all"
          onClick={() => loadQueue()}
        >
          Retry
        </Button>
      </div>
    );
  }

  /* ── Main Render ── */
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 p-4 md:p-6 lg:p-8 relative">
      {/* ── Decorative Background Blobs ── */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

      {/* ── Header ── */}
      <motion.div variants={cardAnim} custom={0} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-fg">
            Action <span className="text-primary-600">Queue</span>
          </h1>
          <p className="text-fg-secondary mt-1 text-sm">View and manage pending actions here.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ListFilter className="h-4 w-4" />}
          className="hover:bg-primary-50 hover:border-primary-200 transition-all"
        >
          Filter
        </Button>
      </motion.div>

      {/* ── Stats Row (only when queue has items) ── */}
      {queue.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={cardAnim}
              custom={i + 1}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl sm:rounded-3xl bg-bg shadow-sm border border-border/40 hover:border-primary-500/30 transition-all duration-300 p-5 sm:p-6 flex flex-col items-center text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-fg-secondary font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Queue List Card ── */}
      <motion.div variants={cardAnim} custom={5}>
        <Card className="rounded-2xl sm:rounded-3xl border border-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-5 sm:p-6 md:p-8">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-fg">
                Pending <span className="text-primary-600">Actions</span>
              </h2>
              {queue.length > 0 && (
                <span className="text-xs text-fg-muted font-semibold uppercase tracking-wider">
                  {queue.length} item{queue.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Empty State */}
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold text-fg mb-1">Queue is empty</p>
                <p className="text-sm text-fg-secondary max-w-xs">
                  No pending actions right now. New complaints and escalations will appear here automatically.
                </p>
              </div>
            ) : (
              /* Queue Rows */
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                {queue.map((item, i) => (
                  <motion.div
                    key={item._id}
                    variants={cardAnim}
                    custom={i}
                    whileHover={{ y: -2 }}
                  >
                    <div className="group border border-border/60 p-5 sm:p-6 rounded-2xl hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-0.5 hover:border-primary-200 transition-all duration-300 bg-bg flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                      {/* Left: Title + Department */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-fg text-base truncate">{item.title}</h3>
                        <p className="text-xs text-fg-muted font-medium mt-1">{item.department}</p>
                      </div>

                      {/* Right: Badges + Date + Arrow */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                        {/* Priority Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${priorityStyles[item.priority] || "bg-surface-muted text-fg-secondary border-border"}`}>
                          {item.priority === "critical" && <AlertTriangle className="h-3 w-3" />}
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusStyles[item.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-fg-muted font-medium whitespace-nowrap inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>

                        {/* Arrow */}
                        <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors hidden md:block" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}