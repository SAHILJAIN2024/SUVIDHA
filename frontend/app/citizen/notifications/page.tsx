"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell, CheckCircle, AlertCircle, Info, Clock,
    Zap, Droplets, Route, Recycle, Check, Trash2, BellOff,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";

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
interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;        // success | warning | info | alert
    department?: string;
    read: boolean;
    createdAt: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; gradient: string; shadow: string; badgeClass: string }> = {
    success: {
        icon: <CheckCircle className="h-5 w-5" />,
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/30",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    warning: {
        icon: <AlertCircle className="h-5 w-5" />,
        gradient: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/30",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
    info: {
        icon: <Info className="h-5 w-5" />,
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/30",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    alert: {
        icon: <Bell className="h-5 w-5" />,
        gradient: "from-rose-500 to-red-600",
        shadow: "shadow-rose-500/30",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    },
};

const deptIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-3 w-3" />,
    water: <Droplets className="h-3 w-3" />,
    roads: <Route className="h-3 w-3" />,
    sanitation: <Recycle className="h-3 w-3" />,
};

const deptGradients: Record<string, string> = {
    electricity: "bg-amber-50 text-amber-700 border-amber-200",
    water: "bg-blue-50 text-blue-700 border-blue-200",
    roads: "bg-violet-50 text-violet-700 border-violet-200",
    sanitation: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            // ── 🔌 BACKEND: Uncomment these lines when your API is ready ──
            // const res = await fetch("http://localhost:5000/api/notifications", {
            //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            // });
            // const data = await res.json();
            // if (!res.ok) throw new Error(data.message || "Failed to load notifications");
            // setNotifications(data.notifications || []);

            // ── 🎭 MOCK: Remove this block when backend is connected ──
            await new Promise((r) => setTimeout(r, 800));
            setNotifications([]);

        } catch (err: any) {
            console.error("Notifications load error:", err);
            setError(err.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleMarkRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    };

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

    const timeAgo = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

    /* ── Loading State ── */
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse" />
                        <div className="h-4 w-32 bg-surface-muted rounded-lg animate-pulse" />
                    </div>
                    <div className="h-9 w-32 rounded-xl bg-surface-muted animate-pulse" />
                </div>
                <div className="h-12 w-56 rounded-2xl bg-surface-muted animate-pulse" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-surface border border-border/40 animate-pulse" />
                ))}
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
                <Button variant="outline" size="sm" className="hover:bg-primary-50 hover:border-primary-200 transition-all" onClick={() => loadNotifications()}>Retry</Button>
            </div>
        );
    }

    /* ── Main Render ── */
    return (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 overflow-hidden">
            {/* ── Decorative Background Blobs ── */}
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0} className="flex items-start justify-between gap-4 flex-wrap gap-y-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                        My <span className="text-primary-600">Notifications</span>
                    </h1>
                    <p className="text-fg-secondary mt-1 text-sm">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "You're all caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Check className="h-4 w-4" />}
                        className="rounded-xl hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all shrink-0"
                        onClick={handleMarkAllRead}
                    >
                        Mark all read
                    </Button>
                )}
            </motion.div>

            {/* ── Filter Tabs ── */}
            <motion.div variants={cardAnim} custom={1}>
                <div className="max-w-full overflow-x-auto">
                    <div className="flex gap-1 p-1.5 bg-surface-muted/50 rounded-2xl border border-border/40 w-fit">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${filter === "all"
                                ? "bg-surface shadow-sm border border-border/60 text-fg"
                                : "text-fg-secondary hover:text-fg"
                                }`}
                        >
                            All
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === "all" ? "bg-primary-100 text-primary-700" : "bg-surface-muted text-fg-muted"
                                }`}>
                                {notifications.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${filter === "unread"
                                ? "bg-surface shadow-sm border border-border/60 text-fg"
                                : "text-fg-secondary hover:text-fg"
                                }`}
                        >
                            Unread
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === "unread" ? "bg-amber-100 text-amber-700" : "bg-surface-muted text-fg-muted"
                                }`}>
                                {unreadCount}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Notification List ── */}
            {filtered.length > 0 ? (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                    {filtered.map((notif, i) => {
                        const config = typeConfig[notif.type] || typeConfig.info;
                        return (
                            <motion.div key={notif._id} variants={cardAnim} custom={i} whileHover={{ y: -2 }}>
                                <div className={`group rounded-2xl sm:rounded-3xl bg-surface border transition-all duration-300 p-5 sm:p-6 ${!notif.read
                                    ? "border-primary-200 bg-primary-50/20 hover:shadow-xl hover:shadow-primary-500/10"
                                    : "border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
                                    }`}>
                                    <div className="flex items-start gap-4">
                                        {/* Type Icon */}
                                        <div className="relative shrink-0">
                                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-md ${config.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                                {config.icon}
                                            </div>
                                            {/* Unread dot */}
                                            {!notif.read && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full ring-2 ring-surface" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={`text-sm sm:text-base font-bold ${!notif.read ? "text-fg" : "text-fg-secondary"}`}>
                                                    {notif.title}
                                                </h3>
                                                {/* Type badge */}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${config.badgeClass}`}>
                                                    {notif.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-fg-muted mt-1 line-clamp-2">{notif.message}</p>
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                {/* Department chip */}
                                                {notif.department && (
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${deptGradients[notif.department] || "bg-surface-muted text-fg-secondary border-border"}`}>
                                                        {deptIcons[notif.department]}
                                                        <span className="capitalize">{notif.department}</span>
                                                    </span>
                                                )}
                                                {/* Time */}
                                                <span className="text-xs text-fg-muted font-medium inline-flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {timeAgo(notif.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {!notif.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
                                                    onClick={() => handleMarkRead(notif._id)}
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                                                onClick={() => handleDelete(notif._id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                /* ── Empty State ── */
                <motion.div variants={cardAnim} custom={2}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                            <BellOff className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-semibold text-fg mb-1">
                            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                        </p>
                        <p className="text-sm text-fg-secondary max-w-xs">
                            {filter === "unread"
                                ? "You've read all your notifications. Switch to 'All' to see your history."
                                : "Notifications about your complaints, bills, and account will appear here."
                            }
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
