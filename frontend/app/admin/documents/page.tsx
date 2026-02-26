"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileText, CheckCircle, XCircle, Eye, Search,
    Clock, AlertCircle, Download, Shield,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Input, Modal } from "@/components/ui";
import { CitizenDocument } from "@/types";
import { getAdminDocuments, verifyDocument, rejectDocument } from "@/services/document.service";
import { useGSAP } from "@/hooks/useGSAP";

const typeLabels: Record<string, string> = {
    aadhaar: "Aadhaar Card",
    pan: "PAN Card",
    "address-proof": "Address Proof",
    property: "Property Document",
    "id-proof": "ID Proof",
    photo: "Passport Photo",
};

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<CitizenDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
    const [search, setSearch] = useState("");
    const [selectedDoc, setSelectedDoc] = useState<CitizenDocument | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        getAdminDocuments()
            .then((data) => { setDocuments(data); setLoading(false); })
            .catch(() => { setError("Failed to load documents"); setLoading(false); });
    }, []);
        const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", { y: 14, stagger: 0.04 });

    const filtered = documents.filter((doc) => {
        const matchesFilter = filter === "all" || doc.status === filter;
        const matchesSearch =
            doc.citizenName.toLowerCase().includes(search.toLowerCase()) ||
            doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
            typeLabels[doc.type]?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const counts = {
        all: documents.length,
        pending: documents.filter((d) => d.status === "pending").length,
        verified: documents.filter((d) => d.status === "verified").length,
        rejected: documents.filter((d) => d.status === "rejected").length,
    };

    const handleVerify = async (docId: string) => {
        try {
            await verifyDocument(docId);
            setDocuments((prev) =>
                prev.map((d) =>
                    d.id === docId
                        ? { ...d, status: "verified" as const, verifiedBy: "Current Admin", verifiedAt: new Date().toISOString() }
                        : d
                )
            );
            setSelectedDoc(null);
        } catch {
            setError("Verification failed");
        }
    };

    const handleReject = async (docId: string) => {
        try {
            const reason = rejectReason || "Document does not meet requirements";
            await rejectDocument(docId, reason);
            setDocuments((prev) =>
                prev.map((d) =>
                    d.id === docId
                        ? { ...d, status: "rejected" as const, rejectionReason: reason }
                        : d
                )
            );
            setShowRejectModal(false);
            setSelectedDoc(null);
            setRejectReason("");
        } catch {
            setError("Rejection failed");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />
                    ))}
                </div>
                <div className="h-96 rounded-2xl bg-surface border border-border animate-pulse" />
            </div>
        );
    }

    if (error && documents.length === 0) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div ref={gsapRef} className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-fg">Document Verification</h1>
                <p className="text-fg-secondary mt-1">Review and verify citizen-uploaded documents</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {([
                    { label: "Total Documents", value: counts.all, icon: FileText, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
                    { label: "Pending Review", value: counts.pending, icon: Clock, color: "text-warning-500", bg: "bg-warning-50 dark:bg-warning-500/10" },
                    { label: "Verified", value: counts.verified, icon: CheckCircle, color: "text-success-500", bg: "bg-success-50 dark:bg-success-500/10" },
                    { label: "Rejected", value: counts.rejected, icon: XCircle, color: "text-danger-500", bg: "bg-danger-50 dark:bg-danger-500/10" },
                ] as const).map((card, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-fg-secondary">{card.label}</p>
                                        <p className="text-3xl font-bold text-fg mt-1">{card.value}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by citizen name, file, or type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {(["all", "pending", "verified", "rejected"] as const).map((f) => (
                                <Button key={f} variant={filter === f ? "primary" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                                    {f} ({counts[f]})
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Documents Table */}
            <Card>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-3 px-3 font-medium text-fg-secondary">Citizen</th>
                                    <th className="py-3 px-3 font-medium text-fg-secondary">Document Type</th>
                                    <th className="py-3 px-3 font-medium text-fg-secondary hidden md:table-cell">File</th>
                                    <th className="py-3 px-3 font-medium text-fg-secondary hidden sm:table-cell">Uploaded</th>
                                    <th className="py-3 px-3 font-medium text-fg-secondary">Status</th>
                                    <th className="py-3 px-3 font-medium text-fg-secondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((doc) => (
                                    <tr key={doc.id} className="border-b border-border/50 hover:bg-surface-muted/50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-xs font-bold shrink-0">
                                                    {doc.citizenName.charAt(0)}
                                                </div>
                                                <span className="font-medium text-fg">{doc.citizenName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <Badge variant="outline" size="sm">{typeLabels[doc.type] || doc.type}</Badge>
                                        </td>
                                        <td className="py-3 px-3 hidden md:table-cell">
                                            <span className="text-fg-secondary text-xs">{doc.fileName}</span>
                                        </td>
                                        <td className="py-3 px-3 hidden sm:table-cell">
                                            <span className="text-fg-muted text-xs">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <StatusBadge
                                                status={doc.status === "verified" ? "resolved" : doc.status === "rejected" ? "rejected" : "pending"}
                                                size="sm"
                                            />
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setSelectedDoc(doc)} className="p-1.5 rounded-lg text-fg-muted hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Preview">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {doc.status === "pending" && (
                                                    <>
                                                        <button onClick={() => handleVerify(doc.id)} className="p-1.5 rounded-lg text-fg-muted hover:text-success-500 hover:bg-success-50 transition-colors" title="Verify">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => { setSelectedDoc(doc); setShowRejectModal(true); }} className="p-1.5 rounded-lg text-fg-muted hover:text-danger-500 hover:bg-danger-50 transition-colors" title="Reject">
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-fg-muted">No documents found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Document Preview Modal */}
            <Modal open={!!selectedDoc && !showRejectModal} onClose={() => setSelectedDoc(null)} title="Document Preview">
                {selectedDoc && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-fg-muted">Citizen</p><p className="font-medium text-fg">{selectedDoc.citizenName}</p></div>
                            <div><p className="text-fg-muted">Document Type</p><p className="font-medium text-fg">{typeLabels[selectedDoc.type]}</p></div>
                            <div><p className="text-fg-muted">File Name</p><p className="font-medium text-fg">{selectedDoc.fileName}</p></div>
                            <div><p className="text-fg-muted">Uploaded</p><p className="font-medium text-fg">{new Date(selectedDoc.uploadedAt).toLocaleString()}</p></div>
                            <div>
                                <p className="text-fg-muted">Status</p>
                                <StatusBadge status={selectedDoc.status === "verified" ? "resolved" : selectedDoc.status === "rejected" ? "rejected" : "pending"} size="sm" />
                            </div>
                            {selectedDoc.verifiedBy && (
                                <div><p className="text-fg-muted">Verified By</p><p className="font-medium text-fg">{selectedDoc.verifiedBy}</p></div>
                            )}
                            {selectedDoc.rejectionReason && (
                                <div className="col-span-2">
                                    <p className="text-fg-muted">Rejection Reason</p>
                                    <p className="font-medium text-danger-500">{selectedDoc.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                        <div className="h-48 bg-surface-muted rounded-xl border border-border flex items-center justify-center">
                            <div className="text-center">
                                <FileText className="h-10 w-10 text-fg-muted mx-auto mb-2" />
                                <p className="text-sm text-fg-muted">Document preview placeholder</p>
                                <Button variant="outline" size="sm" className="mt-3" leftIcon={<Download className="h-3 w-3" />}>Download File</Button>
                            </div>
                        </div>
                        {selectedDoc.status === "pending" && (
                            <div className="flex gap-3">
                                <Button variant="outline" size="sm" className="flex-1 text-success-600 border-success-300 hover:bg-success-50" onClick={() => handleVerify(selectedDoc.id)} leftIcon={<CheckCircle className="h-4 w-4" />}>
                                    Verify Document
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 text-danger-600 border-danger-300 hover:bg-danger-50" onClick={() => setShowRejectModal(true)} leftIcon={<XCircle className="h-4 w-4" />}>
                                    Reject Document
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal open={showRejectModal} onClose={() => { setShowRejectModal(false); setRejectReason(""); }} title="Reject Document">
                <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-danger-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-danger-600">The citizen will be notified of this rejection and the reason provided.</p>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-fg mb-1.5">Rejection Reason</label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explain why this document is being rejected..."
                            rows={3}
                            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-fg placeholder:text-fg-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setShowRejectModal(false); setRejectReason(""); }}>Cancel</Button>
                        <Button variant="danger" size="sm" className="flex-1" onClick={() => selectedDoc && handleReject(selectedDoc.id)}>Reject Document</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
