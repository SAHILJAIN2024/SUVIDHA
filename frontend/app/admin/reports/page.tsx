'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ArrowRight,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  CheckCircle,
  FileEdit,
  Archive,
  Download,
  Zap,
  Droplets,
  Route,
  PieChart,
} from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
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
interface Report {
  _id: string;
  title: string;
  type: string;        // complaint | billing | service | analytics
  status: string;      // published | draft | archived
  createdAt: string;
  summary?: string;
}

const statusStyles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-50 text-slate-500 border-slate-200",
};

const typeGradients: Record<string, string> = {
  complaint: "from-rose-500 to-pink-600",
  billing: "from-amber-500 to-orange-600",
  service: "from-blue-500 to-indigo-600",
  analytics: "from-violet-500 to-purple-600",
};

const typeShadows: Record<string, string> = {
  complaint: "shadow-rose-500/30",
  billing: "shadow-amber-500/30",
  service: "shadow-blue-500/30",
  analytics: "shadow-violet-500/30",
};

const typeIcons: Record<string, React.ReactNode> = {
  complaint: <FileText className="h-4 w-4" />,
  billing: <Zap className="h-4 w-4" />,
  service: <Route className="h-4 w-4" />,
  analytics: <PieChart className="h-4 w-4" />,
};

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18nStore();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // ── 🔌 BACKEND: Uncomment these 3 lines when your API is ready ──
      // const res = await fetch("http://localhost:5000/api/admin/reports", {
      //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Failed to load reports");
      // setReports(data.reports || []);

      // ── 🎭 MOCK: Remove this block when backend is connected ──
      await new Promise((r) => setTimeout(r, 800));
      setReports([]);

    } catch (err: any) {
      console.error("Reports load error:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* ── Computed Stats (hidden when reports is empty) ── */
  const totalCount = reports.length;
  const publishedCount = reports.filter((r) => r.status === "published").length;
  const draftCount = reports.filter((r) => r.status === "draft").length;
  const archivedCount = reports.filter((r) => r.status === "archived").length;

  const statsData = [
    { label: "Total", value: totalCount, icon: <FileText className="h-5 w-5" /> },
    { label: "Published", value: publishedCount, icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Drafts", value: draftCount, icon: <FileEdit className="h-5 w-5" /> },
    { label: "Archived", value: archivedCount, icon: <Archive className="h-5 w-5" /> },
  ];

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="h-9 w-44 bg-surface-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
          onClick={() => loadReports()}
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
            Admin <span className="text-primary-600">Reports</span>
          </h1>
          <p className="text-fg-secondary mt-1 text-sm">View and manage your reports here.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<Download className="h-4 w-4" />}
          className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Export All
        </Button>
      </motion.div>

      {/* ── Stats Row (hidden when empty) ── */}
      {reports.length > 0 && (
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

      {/* ── Reports List Card ── */}
      <motion.div variants={cardAnim} custom={5}>
        <Card className="rounded-2xl sm:rounded-3xl border border-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-5 sm:p-6 md:p-8">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-fg">
                All <span className="text-primary-600">Reports</span>
              </h2>
              {reports.length > 0 && (
                <span className="text-xs text-fg-muted font-semibold uppercase tracking-wider">
                  {reports.length} report{reports.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Empty State */}
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold text-fg mb-1">No reports yet</p>
                <p className="text-sm text-fg-secondary max-w-xs">
                  Generated reports will appear here. Reports are created from complaint data, billing cycles, and analytics snapshots.
                </p>
              </div>
            ) : (
              /* Report Rows */
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                {reports.map((report, i) => (
                  <motion.div
                    key={report._id}
                    variants={cardAnim}
                    custom={i}
                    whileHover={{ y: -2 }}
                  >
                    <div className="group border border-border/60 p-5 sm:p-6 rounded-2xl hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-0.5 hover:border-primary-200 transition-all duration-300 bg-bg flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                      {/* Left: Type icon + Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${typeGradients[report.type] || "from-primary-500 to-primary-600"} flex items-center justify-center text-white shadow-lg ${typeShadows[report.type] || "shadow-primary-500/30"} shrink-0`}>
                          {typeIcons[report.type] || <FileText className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-fg text-base truncate">{report.title}</h3>
                          {report.summary && (
                            <p className="text-xs text-fg-muted mt-0.5 truncate">{report.summary}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Badges + Date + Arrow */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                        {/* Type Badge */}
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-surface-muted/50 text-fg-secondary border-border/60 capitalize">
                          {report.type}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusStyles[report.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-fg-muted font-medium whitespace-nowrap inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
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