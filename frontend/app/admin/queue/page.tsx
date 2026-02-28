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
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Modal } from "@/components/ui";
import { getActionQueue, updateComplaintStatus } from "@/services/admin.service";
import { getComplaintById } from "@/services/complaint.service";
import { AdminAction, Complaint, Department } from "@/types";
import { useAuthStore } from "@/store/auth.store";


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

const roleToDept: Record<string, Department | null> = {
    "admin-electricity": "electricity",
    "admin-water": "water",
    "admin-roads": "roads",
    "admin-sanitation": "sanitation",
    "super-admin": null,
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function ActionQueuePage() {
    const { user } = useAuthStore();
    const adminDept = user?.role ? roleToDept[user.role] ?? null : null;

    const [actions, setActions] = useState<AdminAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewComplaint, setPreviewComplaint] = useState<Complaint | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        getActionQueue()
            .then((data) => {
                const filtered = adminDept ? data.filter((a) => a.department === adminDept) : data;
                setActions(filtered);
                setLoading(false);
            })
            .catch(() => { setError("Failed to load action queue"); setLoading(false); });
    }, [adminDept]);

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

    if (error) {
        return (
            <div className="text-center py-16">
                <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const pendingActions = actions.filter((a) => a.status === "pending" || a.status === "escalated");
    const completedActions = actions.filter((a) => a.status === "in-progress" || a.status === "resolved" || a.status === "rejected");

    return (
        <motion.div initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Action Queue</h1>
                    <p className="text-fg-secondary mt-1">{pendingActions.length} items need attention</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<ArrowUpDown className="h-4 w-4" />}>
                    Sort by Priority
                </Button>
            </div>

            {/* ── 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Queue Summary */}
                <motion.div variants={cardAnim} custom={0}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Queue Summary</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Pending", value: actions.filter(a => a.status === "pending").length, color: "text-warning-500" },
                                    { label: "Escalated", value: actions.filter(a => a.status === "escalated").length, color: "text-danger-500" },
                                    { label: "In Progress", value: actions.filter(a => a.status === "in-progress").length, color: "text-blue-500" },
                                    { label: "Resolved", value: actions.filter(a => a.status === "resolved" || a.status === "rejected").length, color: "text-success-500" },
                                ].map((s) => (
                                    <div key={s.label} className="p-3 rounded-xl bg-surface-muted text-center hover:bg-surface-muted/70 transition-colors">
                                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-xs text-fg-muted mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Priority Breakdown */}
                <motion.div variants={cardAnim} custom={1}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Priority Breakdown</h2>
                            <div className="space-y-3">
                                {["critical", "high", "medium", "low"].map((p) => {
                                    const count = actions.filter(a => a.priority === p).length;
                                    const pct = actions.length > 0 ? (count / actions.length) * 100 : 0;
                                    return (
                                        <div key={p} className="flex items-center gap-3">
                                            <span className={`text-sm font-medium capitalize w-16 ${priorityColors[p]}`}>{p}</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%`, backgroundColor: p === "critical" ? "#EF4444" : p === "high" ? "#F59E0B" : p === "medium" ? "#6B7280" : "#9CA3AF" }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-fg w-8 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Full-width Table Card */}
            <motion.div variants={cardAnim} custom={2}>
                <Card padding="none" className="hover:shadow-lg transition-shadow duration-300">
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
            </motion.div>

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
        </motion.div>
    );
}
