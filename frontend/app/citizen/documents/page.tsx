"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, XCircle, Clock, Shield, Eye, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { getCitizenDocuments, uploadDocument, deleteDocument, CDocumentItem } from "@/services/document.service";
import { useGSAP } from "@/hooks/useGSAP";

const statusConfig: Record<string, { icon: React.ReactNode; label: string; variant: "success" | "warning" | "danger" }> = {
    verified: { icon: <CheckCircle className="h-3 w-3" />, label: "Verified", variant: "success" },
    pending: { icon: <Clock className="h-3 w-3" />, label: "Pending Review", variant: "warning" },
    rejected: { icon: <XCircle className="h-3 w-3" />, label: "Rejected", variant: "danger" },
};

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
        const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", { y: 14, stagger: 0.04 });

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

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-surface border border-border animate-pulse" />)}
                </div>
                <div className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-surface border border-border animate-pulse" />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div ref={gsapRef} className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-fg">Document Verification</h1>
                <p className="text-fg-secondary mt-1">Upload and manage your identity & address documents</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <CheckCircle className="h-5 w-5 text-success-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-fg">{verifiedCount}</p>
                            <p className="text-xs text-fg-muted">Verified</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <Clock className="h-5 w-5 text-warning-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-fg">{pendingCount}</p>
                            <p className="text-xs text-fg-muted">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-center">
                            <XCircle className="h-5 w-5 text-danger-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-fg">{rejectedCount}</p>
                            <p className="text-xs text-fg-muted">Rejected</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Aadhaar Status */}
            <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border-primary-200 dark:border-primary-800">
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-fg">Aadhaar Verification</p>
                            <p className="text-sm text-fg-secondary">
                                {user?.aadhaarVerified ? "Your identity has been verified via Aadhaar" : "Aadhaar not yet verified"}
                            </p>
                        </div>
                        <Badge variant={user?.aadhaarVerified ? "success" : "warning"} size="lg">
                            {user?.aadhaarVerified ? <><CheckCircle className="h-3 w-3" /> Verified</> : <><Clock className="h-3 w-3" /> Pending</>}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Document List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-fg">My Documents</h2>
                    <Button size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={handleUpload} isLoading={uploading}>
                        Upload Document
                    </Button>
                </div>

                {documents.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-10 w-10 text-fg-muted mx-auto mb-3" />
                        <p className="text-fg-secondary">No documents uploaded yet</p>
                    </div>
                )}

                {documents.map((doc, i) => {
                    const config = statusConfig[doc.status];
                    return (
                        <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-fg-secondary shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-fg">{doc.name}</h3>
                                                <Badge variant={config.variant} size="sm">{config.icon} {config.label}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-fg-muted">
                                                <span className="capitalize">{doc.type}</span>
                                                <span>•</span>
                                                <span>Uploaded: {doc.uploadedAt}</span>
                                            </div>
                                            {doc.rejectionReason && (
                                                <p className="mt-2 text-xs text-danger-500 bg-danger-50 dark:bg-danger-500/10 rounded-lg p-2">
                                                    ⚠ {doc.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-danger-500" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Upload Zone */}
            <Card>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary-400 transition-colors cursor-pointer" onClick={handleUpload}>
                        <Upload className="h-10 w-10 text-fg-muted mx-auto mb-3" />
                        <p className="text-sm font-medium text-fg">Drop files here or click to upload</p>
                        <p className="text-xs text-fg-muted mt-1">PDF, JPG, PNG — Max 5MB per file</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
