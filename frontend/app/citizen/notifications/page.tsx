"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Clock,
    Zap,
    Droplets,
    Route,
    Recycle,
    Check,
    Trash2,
    BellOff,
    Filter,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";

interface Notification {
    id: string;
    type: "success" | "warning" | "info" | "alert";
    title: string;
    message: string;
    department?: string;
    complaintId?: string;
    timestamp: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: "n1", type: "success", title: "Complaint Resolved", message: "Your complaint CMP-2025-003 (Pothole near School Zone) has been resolved. Please rate the service.", complaintId: "CMP-2025-003", department: "roads", timestamp: "2025-12-08T10:30:00Z", read: false },
    { id: "n2", type: "warning", title: "Complaint Escalated", message: "Your complaint CMP-2025-004 (Garbage not collected) has been auto-escalated to Senior Officer due to no response in 48 hours.", complaintId: "CMP-2025-004", department: "sanitation", timestamp: "2025-12-07T16:30:00Z", read: false },
    { id: "n3", type: "info", title: "Status Update", message: "Complaint CMP-2025-001 (Streetlight not working) — Electrician Team B has been dispatched for inspection.", complaintId: "CMP-2025-001", department: "electricity", timestamp: "2025-12-06T14:00:00Z", read: false },
    { id: "n4", type: "alert", title: "Bill Payment Due", message: "Your Gas bill of ₹1,120 for Jan 2026 is overdue. Please pay immediately to avoid disconnection.", timestamp: "2025-12-06T08:00:00Z", read: true },
    { id: "n5", type: "info", title: "Welcome to SUVIDHA", message: "Your account has been created and Aadhaar verified. You can now file complaints, pay bills, and access civic services.", timestamp: "2025-06-15T10:00:00Z", read: true },
    { id: "n6", type: "success", title: "Bill Payment Received", message: "₹2,180 payment for Electricity bill (Jan 2026) has been received. Receipt ID: RCP-789456.", timestamp: "2025-12-05T09:00:00Z", read: true },
    { id: "n7", type: "warning", title: "Scheduled Maintenance", message: "Water supply in Ward 12 will be interrupted on Dec 10 from 10 AM to 4 PM for pipeline maintenance.", department: "water", timestamp: "2025-12-04T12:00:00Z", read: true },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    success: { icon: <CheckCircle className="h-5 w-5" />, color: "text-success-500", bg: "bg-success-50 dark:bg-success-500/10" },
    warning: { icon: <AlertCircle className="h-5 w-5" />, color: "text-warning-500", bg: "bg-warning-50 dark:bg-warning-500/10" },
    info: { icon: <Info className="h-5 w-5" />, color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-500/10" },
    alert: { icon: <Bell className="h-5 w-5" />, color: "text-danger-500", bg: "bg-danger-50 dark:bg-danger-500/10" },
};

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-3 w-3" />,
    water: <Droplets className="h-3 w-3" />,
    roads: <Route className="h-3 w-3" />,
    sanitation: <Recycle className="h-3 w-3" />,
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const markRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

    const timeAgo = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Notifications</h1>
                    <p className="text-fg-secondary mt-1">{unreadCount} unread notifications</p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} leftIcon={<Check className="h-4 w-4" />}>
                            Mark all read
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 p-1 bg-surface-muted rounded-xl w-fit">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-surface shadow-sm text-fg" : "text-fg-secondary hover:text-fg"}`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "unread" ? "bg-surface shadow-sm text-fg" : "text-fg-secondary hover:text-fg"}`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notification List */}
            <div className="space-y-2">
                {displayed.map((notif, i) => {
                    const config = typeConfig[notif.type];
                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <Card
                                className={`transition-all hover:shadow-md cursor-pointer ${!notif.read ? "border-l-4 border-l-primary-500" : ""}`}
                                onClick={() => markRead(notif.id)}
                            >
                                <CardContent>
                                    <div className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color} shrink-0`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`text-sm font-semibold ${!notif.read ? "text-fg" : "text-fg-secondary"}`}>
                                                            {notif.title}
                                                        </h3>
                                                        {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                                                    </div>
                                                    <p className="text-xs text-fg-secondary mt-0.5 line-clamp-2">{notif.message}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-fg-muted">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{timeAgo(notif.timestamp)}</span>
                                                        {notif.department && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1 capitalize">{deptIcons[notif.department]} {notif.department}</span>
                                                            </>
                                                        )}
                                                        {notif.complaintId && (
                                                            <>
                                                                <span>•</span>
                                                                <Badge variant="outline" size="sm">{notif.complaintId}</Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                    className="p-1.5 rounded-lg text-fg-muted hover:text-danger-500 hover:bg-danger-50 transition-colors shrink-0"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

                {displayed.length === 0 && (
                    <div className="text-center py-16">
                        <BellOff className="h-10 w-10 text-fg-muted mx-auto mb-3" />
                        <p className="text-fg-secondary">No {filter === "unread" ? "unread " : ""}notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
}
