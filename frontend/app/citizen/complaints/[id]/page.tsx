"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ChevronUp,
    ChevronDown,
    Clock,
    MapPin,
    User,
    Zap,
    Droplets,
    Route,
    Recycle,
    Share2,
    Flag,
    Edit3,
    XCircle,
    MessageSquare,
    Send,
    Shield,
    AlertTriangle,
    Timer,
} from "lucide-react";
import { Card, CardContent, Button, Badge, StatusBadge, Input, Textarea, Modal } from "@/components/ui";
import { getComplaintById, voteComplaint } from "@/services/complaint.service";
import { Complaint } from "@/types";

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-5 w-5" />,
    water: <Droplets className="h-5 w-5" />,
    roads: <Route className="h-5 w-5" />,
    sanitation: <Recycle className="h-5 w-5" />,
};

const deptColors: Record<string, string> = {
    electricity: "#F59E0B",
    water: "#3B82F6",
    roads: "#8B5CF6",
    sanitation: "#10B981",
};

// Mock comments/feedback
interface Comment {
    id: string;
    user: string;
    text: string;
    timestamp: string;
    isAuthority: boolean;
}

const mockComments: Comment[] = [
    { id: "c1", user: "Priya Sharma", text: "Same issue in my area too! The streetlight has been off for 2 weeks now.", timestamp: "2025-12-05T14:30:00Z", isAuthority: false },
    { id: "c2", user: "Electricity Dept. (Officer Verma)", text: "Team has been dispatched. Expected resolution within 48 hours.", timestamp: "2025-12-06T09:00:00Z", isAuthority: true },
    { id: "c3", user: "Amit Patel", text: "Please fix this urgently. It's a safety concern for evening commuters.", timestamp: "2025-12-06T18:45:00Z", isAuthority: false },
];

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>(mockComments);
    const [newComment, setNewComment] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [closeModalOpen, setCloseModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [closeReason, setCloseReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const id = params.id as string;
        getComplaintById(id).then((data) => {
            setComplaint(data || null);
            if (data) {
                setEditTitle(data.title);
                setEditDesc(data.description);
            }
            setLoading(false);
        });
    }, [params.id]);

    const handleVote = async (direction: "up" | "down") => {
        if (!complaint || complaint.hasVoted) return;
        if (direction === "up") {
            const updated = await voteComplaint(complaint.id);
            if (updated) setComplaint({ ...complaint, votes: updated.votes, hasVoted: true });
        } else {
            setComplaint({ ...complaint, votes: Math.max(0, complaint.votes - 1), hasVoted: true });
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: `c${comments.length + 1}`,
            user: "Rajesh Kumar (You)",
            text: newComment,
            timestamp: new Date().toISOString(),
            isAuthority: false,
        };
        setComments((prev) => [...prev, comment]);
        setNewComment("");
    };

    const handleModify = async () => {
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        if (complaint) {
            setComplaint({ ...complaint, title: editTitle, description: editDesc });
        }
        setSubmitting(false);
        setEditModalOpen(false);
    };

    const handleClose = async () => {
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        if (complaint) {
            setComplaint({ ...complaint, status: "resolved" });
        }
        setSubmitting(false);
        setCloseModalOpen(false);
    };

    // Calculate escalation timer (mock: pending > 48hrs = escalated)
    const getEscalationInfo = () => {
        if (!complaint) return null;
        if (complaint.status === "escalated") return { label: "Auto-escalated to Senior Officer", urgent: true };
        if (complaint.status === "pending") {
            const hoursElapsed = Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60));
            const hoursLeft = Math.max(0, 48 - hoursElapsed);
            if (hoursLeft === 0) return { label: "Will auto-escalate soon", urgent: true };
            return { label: `Auto-escalation in ${hoursLeft}h if no response`, urgent: false };
        }
        return null;
    };

    const escalation = getEscalationInfo();

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="h-8 w-48 rounded bg-surface-muted animate-pulse" />
                <div className="h-64 rounded-2xl bg-surface border border-border animate-pulse" />
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <p className="text-fg-secondary">Complaint not found</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" size="sm">{complaint.id}</Badge>
                        <StatusBadge status={complaint.status} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Modify & Close actions */}
                    {complaint.status !== "resolved" && complaint.status !== "rejected" && (
                        <>
                            <Button variant="outline" size="sm" leftIcon={<Edit3 className="h-3 w-3" />} onClick={() => setEditModalOpen(true)}>
                                Modify
                            </Button>
                            <Button variant="danger" size="sm" leftIcon={<XCircle className="h-3 w-3" />} onClick={() => setCloseModalOpen(true)}>
                                Close
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Flag className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Escalation Warning */}
            {escalation && (
                <div className={`flex items-center gap-3 p-3 rounded-xl ${escalation.urgent ? "bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-800" : "bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-800"}`}>
                    {escalation.urgent ? <AlertTriangle className="h-5 w-5 text-danger-500" /> : <Timer className="h-5 w-5 text-warning-500" />}
                    <div>
                        <p className={`text-sm font-medium ${escalation.urgent ? "text-danger-700 dark:text-danger-400" : "text-warning-700 dark:text-warning-400"}`}>
                            {escalation.label}
                        </p>
                        <p className="text-xs text-fg-muted mt-0.5">
                            Complaints are auto-forwarded to higher authority after 48 hours without response
                        </p>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <Card>
                <CardContent>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: deptColors[complaint.department] }}>
                            {deptIcons[complaint.department]}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-fg">{complaint.title}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant="outline" size="sm" className="capitalize">{complaint.department}</Badge>
                                <Badge variant={complaint.priority === "critical" ? "danger" : complaint.priority === "high" ? "warning" : "default"} size="sm">{complaint.priority} priority</Badge>
                            </div>
                        </div>
                        {/* Reddit-style voting */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                            <button
                                onClick={() => handleVote("up")}
                                disabled={complaint.hasVoted}
                                className={`p-1.5 rounded transition-colors ${complaint.hasVoted ? "text-primary-600" : "text-fg-muted hover:text-primary-600 hover:bg-primary-50 cursor-pointer"}`}
                            >
                                <ChevronUp className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-bold text-fg">{complaint.votes}</span>
                            <button
                                onClick={() => handleVote("down")}
                                disabled={complaint.hasVoted}
                                className={`p-1.5 rounded transition-colors ${complaint.hasVoted ? "text-fg-muted" : "text-fg-muted hover:text-danger-500 hover:bg-danger-50 cursor-pointer"}`}
                            >
                                <ChevronDown className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <p className="text-fg-secondary leading-relaxed">{complaint.description}</p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 rounded-xl bg-surface-muted">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-fg-muted" />
                            <div>
                                <p className="text-xs text-fg-muted">Filed by</p>
                                <p className="text-sm font-medium text-fg">{complaint.citizenName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-fg-muted" />
                            <div>
                                <p className="text-xs text-fg-muted">Ward</p>
                                <p className="text-sm font-medium text-fg">{complaint.ward}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-fg-muted" />
                            <div>
                                <p className="text-xs text-fg-muted">Filed on</p>
                                <p className="text-sm font-medium text-fg">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-fg-muted" />
                            <div>
                                <p className="text-xs text-fg-muted">Assigned To</p>
                                <p className="text-sm font-medium text-fg">{complaint.assignedTo || "Pending assignment"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Activity Timeline</h2>
                    <div className="space-y-0">
                        {complaint.timeline.map((entry, i) => (
                            <div key={entry.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-primary-600" : "bg-border-strong"}`} />
                                    {i < complaint.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                                </div>
                                <div className="pb-6">
                                    <p className="text-sm font-medium text-fg">{entry.action}</p>
                                    <p className="text-xs text-fg-secondary mt-0.5">{entry.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-fg-muted">{entry.by}</span>
                                        <span className="text-xs text-fg-muted">•</span>
                                        <span className="text-xs text-fg-muted">{new Date(entry.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* People Feedback / Comments */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">
                        <MessageSquare className="h-5 w-5 inline mr-2" />
                        People Feedback ({comments.length})
                    </h2>

                    <div className="space-y-4 mb-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className={`p-3 rounded-xl ${comment.isAuthority ? "bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800" : "bg-surface-muted"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${comment.isAuthority ? "bg-primary-600" : "bg-fg-secondary"}`}>
                                        {comment.user.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-fg">{comment.user}</span>
                                    {comment.isAuthority && (
                                        <Badge variant="primary" size="sm"><Shield className="h-2.5 w-2.5" /> Official</Badge>
                                    )}
                                    <span className="text-xs text-fg-muted ml-auto">{new Date(comment.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-fg-secondary ml-8">{comment.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Add your feedback..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            />
                        </div>
                        <Button onClick={handleAddComment} disabled={!newComment.trim()} leftIcon={<Send className="h-4 w-4" />}>
                            Post
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Map */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Location</h2>
                    <div className="aspect-video rounded-xl bg-surface-muted border border-border flex items-center justify-center">
                        <div className="text-center text-fg-muted">
                            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary-400" />
                            <p className="text-sm">{complaint.location.lat}, {complaint.location.lng}</p>
                            <p className="text-xs mt-1">Interactive map — {complaint.ward}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modify Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Modify Complaint" size="md">
                <div className="space-y-4">
                    <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <Textarea label="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleModify} isLoading={submitting}>Save Changes</Button>
                    </div>
                </div>
            </Modal>

            {/* Close Modal */}
            <Modal open={closeModalOpen} onClose={() => setCloseModalOpen(false)} title="Close Complaint" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-fg-secondary">
                        Are you sure you want to close this complaint? This will mark it as resolved.
                    </p>
                    <Textarea
                        label="Reason for closing (optional)"
                        placeholder="e.g. Issue has been fixed, no longer relevant..."
                        value={closeReason}
                        onChange={(e) => setCloseReason(e.target.value)}
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setCloseModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-1" onClick={handleClose} isLoading={submitting}>Close Complaint</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
