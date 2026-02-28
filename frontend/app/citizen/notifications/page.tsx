"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell, CheckCircle, AlertCircle, Info, Clock,
    Zap, Droplets, Route, Recycle, Check, Trash2, BellOff,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";


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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unread">("all");


    
    const timeAgo = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="h-8 w-40 bg-surface-muted rounded-lg animate-pulse" />
                {[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />)}
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
        <div  className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Notifications</h1>
                 
                </div>
               
            </div>

            
        </div>
    );
}
