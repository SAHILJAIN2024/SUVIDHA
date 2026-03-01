"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, XCircle, Clock, Shield, Eye, Trash2, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { getCitizenDocuments, uploadDocument, deleteDocument, CDocumentItem } from "@/services/document.service";

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
const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    verified: {
        icon: <CheckCircle className="h-3 w-3" />,
        label: "Verified",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
        icon: <Clock className="h-3 w-3" />,
        label: "Pending Review",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    rejected: {
        icon: <XCircle className="h-3 w-3" />,
        label: "Rejected",
        className: "bg-rose-50 text-rose-700 border-rose-200",
    },
};

const statsData = [
    {
        key: "verified",
        label: "Verified",
        icon: <CheckCircle className="h-5 w-5" />,
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/30",
    },
    {
        key: "pending",
        label: "Pending",
        icon: <Clock className="h-5 w-5" />,
        gradient: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/30",
    },
    {
        key: "rejected",
        label: "Rejected",
        icon: <XCircle className="h-5 w-5" />,
        gradient: "from-rose-500 to-red-600",
        shadow: "shadow-rose-500/30",
    },
];

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function DocumentVerificationPage() {
    const { user } = useAuthStore();
    const [documents, setDocuments] = useState<CDocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getCitizenDocuments()
            .then((data) => { setDocuments(data); setLoading(false); })
            .catch(() => { setError("Failed to load documents"); setLoading(false); });
    }, []);

    const handleUpload = async () => {
        setUploading(true);
        try {
            const newDoc = await uploadDocument("New Document");
            setDocuments((prev) => [...prev, newDoc]);
        } catch {
            setError("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
        } catch {
            setError("Delete failed");
        }
    };

    const verifiedCount = documents.filter((d) => d.status === "verified").length;
    const pendingCount = documents.filter((d) => d.status === "pending").length;
    const rejectedCount = documents.filter((d) => d.status === "rejected").length;
    const countsMap: Record<string, number> = { verified: verifiedCount, pending: pendingCount, rejected: rejectedCount };

    /* ── Loading State ── */
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-9 w-56 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />)}
                </div>
                <div className="h-28 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />)}
            </div>
        );
    }

    /* ── Error State ── */
    if (error) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-danger-500" />
                </div>
                <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
                <p className="text-sm text-fg-secondary mb-4">{error}</p>
                <Button variant="outline" size="sm" className="hover:bg-primary-50 hover:border-primary-200 transition-all" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    /* ── Main Render ── */
    return (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative space-y-8 overflow-hidden">
            {/* ── Decorative Background Blobs ── */}
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0}>
                <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                    Document <span className="text-primary-600">Verification</span>
                </h1>
                <p className="text-fg-secondary mt-1 text-sm">Upload and manage your identity &amp; address documents</p>
            </motion.div>

            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {statsData.map((stat, i) => (
                    <motion.div
                        key={stat.key}
                        variants={cardAnim}
                        custom={i + 1}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-2xl sm:rounded-3xl bg-bg shadow-sm border border-border/40 hover:border-primary-500/30 transition-all duration-300 p-4 sm:p-5 flex items-center gap-3"
                    >
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} shrink-0`}>
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                {countsMap[stat.key]}
                            </div>
                            <p className="text-[10px] sm:text-xs text-fg-secondary font-semibold uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Aadhaar Status Banner ── */}
            <motion.div variants={cardAnim} custom={4} whileHover={{ y: -4, scale: 1.01 }}>
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white p-5 sm:p-6 shadow-xl shadow-primary-900/20">
                    {/* Inner decorative glows */}
                    <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[120px] h-[120px] bg-accent-400/15 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 border border-white/20 shadow-md shadow-primary-500/30 flex items-center justify-center shrink-0">
                            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white/90" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-white text-base sm:text-lg">Aadhaar Verification</p>
                            <p className="text-sm text-white/60 mt-0.5">
                                {user?.aadhaarVerified ? "Your identity has been verified via Aadhaar" : "Aadhaar not yet verified"}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 inline-flex items-center gap-1.5 ${user?.aadhaarVerified
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {user?.aadhaarVerified ? "Verified" : "Pending"}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* ── Document List ── */}
            <div className="space-y-4">
                <motion.div variants={cardAnim} custom={5} className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-fg">
                        My <span className="text-primary-600">Documents</span>
                    </h2>
                    <Button
                        size="sm"
                        leftIcon={<Upload className="h-4 w-4" />}
                        className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        onClick={handleUpload}
                        isLoading={uploading}
                    >
                        Upload Document
                    </Button>
                </motion.div>

                {/* Empty State */}
                {documents.length === 0 && (
                    <motion.div variants={cardAnim} custom={6}>
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                                <FileText className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-semibold text-fg mb-1">No documents uploaded yet</p>
                            <p className="text-sm text-fg-secondary max-w-xs">
                                Upload your identity and address documents to get them verified.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Document Rows */}
                {documents.length > 0 && (
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                        {documents.map((doc, i) => {
                            const config = statusConfig[doc.status] || statusConfig.pending;
                            return (
                                <motion.div key={doc.id} variants={cardAnim} custom={i} whileHover={{ y: -2 }}>
                                    <div className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 sm:p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Doc Icon */}
                                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-[-4deg] transition-transform duration-500">
                                                <FileText className="h-5 w-5" />
                                            </div>

                                            {/* Doc Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-sm sm:text-base font-bold text-fg">{doc.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${config.className}`}>
                                                        {config.icon} {config.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 text-xs text-fg-muted font-medium">
                                                    <span className="capitalize">{doc.type}</span>
                                                    <span className="text-border">•</span>
                                                    <span>Uploaded: {doc.uploadedAt}</span>
                                                </div>
                                                {doc.rejectionReason && (
                                                    <div className="mt-2 px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200/60 text-xs text-rose-700 font-medium">
                                                        ⚠ {doc.rejectionReason}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-danger-500 hover:bg-rose-50 hover:text-rose-600 transition-all" onClick={() => handleDelete(doc.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-primary-600 transition-colors hidden md:block" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* ── Upload Drop Zone ── */}
            <motion.div variants={cardAnim} custom={7}>
                <div
                    className="group cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed border-border/60 hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 p-8 sm:p-10 text-center"
                    onClick={handleUpload}
                >
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-7 w-7" />
                    </div>
                    <p className="text-base font-semibold text-fg mb-1">Drop files here or click to upload</p>
                    <p className="text-sm text-fg-secondary">PDF, JPG, PNG — Max 5MB per file</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
