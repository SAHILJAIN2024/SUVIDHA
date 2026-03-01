'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Upload,
  Eye,
  Download,
  AlertCircle,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
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
interface Document {
  _id: string;
  name: string;
  type: string;           // aadhaar | pan | license | utility_bill | other
  status: string;         // verified | pending | rejected
  uploadedAt: string;
  rejectionReason?: string;
  fileUrl?: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  verified: {
    label: "Verified",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const { t } = useI18nStore();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      // ── 🔌 BACKEND: Uncomment these lines when your API is ready ──
      // const res = await fetch("http://localhost:5000/api/admin/documents", {
      //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Failed to load documents");
      // setDocuments(data.documents || []);
      // setAadhaarVerified(data.aadhaarVerified || false);

      // ── 🎭 MOCK: Remove this block when backend is connected ──
      await new Promise((r) => setTimeout(r, 800));
      setDocuments([]);
      setAadhaarVerified(false);

    } catch (err: any) {
      console.error("Documents load error:", err);
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  /* ── Computed Stats ── */
  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;

  const statsData = [
    {
      label: "Verified",
      value: verifiedCount,
      icon: <CheckCircle className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: <Clock className="h-5 w-5" />,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/30",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: <XCircle className="h-5 w-5" />,
      gradient: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/30",
    },
  ];

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="h-9 w-56 bg-surface-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
          ))}
        </div>
        <div className="h-28 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
        ))}
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
        <Button variant="outline" size="sm" className="hover:bg-primary-50 hover:border-primary-200 transition-all" onClick={() => loadDocuments()}>
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
      <motion.div variants={cardAnim} custom={0}>
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          Document <span className="text-primary-600">Verification</span>
        </h1>
        <p className="text-fg-secondary mt-1 text-sm">View and manage citizen document submissions.</p>
      </motion.div>

      {/* ── Summary Stats (hidden when no documents) ── */}
      {documents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={cardAnim}
              custom={i + 1}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl sm:rounded-3xl bg-bg shadow-sm border border-border/40 hover:border-primary-500/30 transition-all duration-300 p-5 sm:p-6 flex items-center gap-4"
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-xs text-fg-secondary font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Aadhaar Verification Banner ── */}
      <motion.div variants={cardAnim} custom={4} whileHover={{ y: -4, scale: 1.01 }}>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white p-6 sm:p-8 shadow-xl shadow-primary-900/20">
          {/* Inner decorative glow */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-accent-400/15 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 border border-white/20 shadow-md shadow-primary-500/30 flex items-center justify-center shrink-0">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white/90" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Aadhaar Verification</h2>
                <p className="text-sm text-white/60 mt-0.5">Identity verification via Aadhaar is required for full access.</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 inline-flex items-center gap-1.5 ${aadhaarVerified
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {aadhaarVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Upload Drop Zone ── */}
      <motion.div variants={cardAnim} custom={5}>
        <label className="group cursor-pointer block rounded-2xl sm:rounded-3xl border-2 border-dashed border-border/60 hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 p-8 sm:p-10 text-center">
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-base font-semibold text-fg mb-1">Drop files here or click to upload</p>
          <p className="text-sm text-fg-secondary">Supports PDF, JPG, PNG — Max 5 MB</p>
        </label>
      </motion.div>

      {/* ── Document Rows ── */}
      {documents.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {documents.map((doc, i) => {
            const status = statusConfig[doc.status] || statusConfig.pending;
            return (
              <motion.div key={doc._id} variants={cardAnim} custom={i} whileHover={{ y: -2 }}>
                <div className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Doc Icon */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-[-4deg] transition-transform duration-500">
                      <FileText className="h-5 w-5" />
                    </div>

                    {/* Doc Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-fg text-base truncate">{doc.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted font-medium">
                        <span className="capitalize">{doc.type.replace("_", " ")}</span>
                        <span className="text-border">•</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      {doc.status === "rejected" && doc.rejectionReason && (
                        <div className="mt-2 px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200/60 text-xs text-rose-700 font-medium">
                          Reason: {doc.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {doc.fileUrl && (
                        <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.status === "rejected" && (
                        <Button variant="ghost" size="sm" className="rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors hidden md:block" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div variants={cardAnim} custom={6}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-fg mb-1">No documents yet</p>
            <p className="text-sm text-fg-secondary max-w-xs">
              Upload your first document above. Submitted documents will appear here for review and verification.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}