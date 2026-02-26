"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    AlertTriangle,
    Zap,
    Droplets,
    Route,
    Recycle,
    ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Modal } from "@/components/ui";
import { getActionQueue, updateComplaintStatus } from "@/services/admin.service";
import { getComplaintById } from "@/services/complaint.service";
import { AdminAction, Complaint } from "@/types";

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-4 w-4" />,
    water: <Droplets className="h-4 w-4" />,
    roads: <Route className="h-4 w-4" />,
    sanitation: <Recycle className="h-4 w-4" />,
};

const priorityColors: Record<string, string> = {
    critical: "text-danger-500",
    high: "text-warning-500",
    medium: "text-fg-secondary",
    low: "text-fg-muted",
};

export default function ActionQueuePage() {
    const [actions, setActions] = useState<AdminAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewComplaint, setPreviewComplaint] = useState<Complaint | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        getActionQueue().then((data) => {
            setActions(data);
            setLoading(false);
        });
    }, []);

    const handleAccept = async (action: AdminAction) => {
        setProcessing(action.id);
        await updateComplaintStatus(action.complaintId, "in-progress");
        setActions((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: "in-progress" } : a)));
        setProcessing(null);
    };

    const handleReject = async (action: AdminAction) => {
        setProcessing(action.id);
        await updateComplaintStatus(action.complaintId, "rejected");
        setActions((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: "rejected" } : a)));
        setProcessing(null);
    };

    const handlePreview = async (complaintId: string) => {
        const complaint = await getComplaintById(complaintId);
        if (complaint) {
            setPreviewComplaint(complaint);
            setPreviewOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Action Queue</h1>
                    <p className="text-fg-secondary mt-1">{actions.filter((a) => a.status === "pending" || a.status === "escalated").length} items need attention</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="h-4 w-4" />}>
                    Sort by Priority
                </Button>
            </div>

            {/* Queue Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface-muted/50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Complaint</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Department</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider hidden sm:table-cell">Priority</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider hidden md:table-cell">Ward</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-fg-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actions.map((action, i) => (
                                <motion.tr
                                    key={action.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="border-b border-border last:border-0 hover:bg-surface-muted/30 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-fg truncate max-w-[200px] lg:max-w-[300px]">{action.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-fg-muted">{action.complaintId}</span>
                                                <span className="text-xs text-fg-muted">•</span>
                                                <span className="text-xs text-fg-muted">{action.citizenName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-fg-secondary">{deptIcons[action.department]}</span>
                                            <span className="capitalize text-fg-secondary">{action.department}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 hidden sm:table-cell">
                                        <div className={`flex items-center gap-1 capitalize font-medium ${priorityColors[action.priority]}`}>
                                            {action.priority === "critical" && <AlertTriangle className="h-3 w-3" />}
                                            {action.priority}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 hidden md:table-cell text-fg-secondary">{action.ward}</td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={action.status} size="sm" />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePreview(action.complaintId)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {(action.status === "pending" || action.status === "escalated") && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleAccept(action)}
                                                        disabled={processing === action.id}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleReject(action)}
                                                        disabled={processing === action.id}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Preview Modal */}
            <Modal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Complaint Details"
                size="lg"
            >
                {previewComplaint && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-fg">{previewComplaint.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <StatusBadge status={previewComplaint.status} />
                                <Badge variant="outline" size="sm">{previewComplaint.id}</Badge>
                            </div>
                        </div>
                        <p className="text-sm text-fg-secondary leading-relaxed">{previewComplaint.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-lg bg-surface-muted">
                                <p className="text-xs text-fg-muted">Department</p>
                                <p className="font-medium text-fg capitalize">{previewComplaint.department}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-muted">
                                <p className="text-xs text-fg-muted">Priority</p>
                                <p className="font-medium text-fg capitalize">{previewComplaint.priority}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-muted">
                                <p className="text-xs text-fg-muted">Filed by</p>
                                <p className="font-medium text-fg">{previewComplaint.citizenName}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-muted">
                                <p className="text-xs text-fg-muted">Ward</p>
                                <p className="font-medium text-fg">{previewComplaint.ward}</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h4 className="text-sm font-semibold text-fg mb-3">Timeline</h4>
                            <div className="space-y-0">
                                {previewComplaint.timeline.map((entry, idx) => (
                                    <div key={entry.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-primary-600" : "bg-border-strong"}`} />
                                            {idx < previewComplaint.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm font-medium text-fg">{entry.action}</p>
                                            <p className="text-xs text-fg-muted">{entry.by} • {new Date(entry.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
