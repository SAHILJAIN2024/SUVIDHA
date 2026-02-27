"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Droplets, Route, Recycle, ArrowRight, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { getDepartments, getQuickActions, DepartmentInfo, QuickAction } from "@/services/ward.service";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Zap, Droplets, Route, Recycle, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck,
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function ServicesPage() {
    const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
    const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getDepartments(), getQuickActions()])
            .then(([depts, actions]) => { setDepartments(depts); setQuickActions(actions); setLoading(false); })
            .catch(() => { setError("Failed to load services"); setLoading(false); });
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-32 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />)}
                </div>
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

    return (
        <motion.div initial="hidden" animate="visible" className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-fg">Services</h1>
                <p className="text-fg-secondary mt-1">Browse and access civic services by department</p>
            </div>

            {/* Quick Actions — 2-column card grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Quick Actions */}
                <motion.div variants={cardAnim} custom={0}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {quickActions.map((action, i) => {
                                    const Icon = iconMap[action.icon] || FileText;
                                    return (
                                        <Link key={i} href={action.href}>
                                            <motion.div
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-muted hover:bg-surface-muted/70 transition-all cursor-pointer"
                                            >
                                                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm font-medium text-fg text-center">{action.label}</span>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Department Overview */}
                <motion.div variants={cardAnim} custom={1}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Department Overview</h2>
                            <div className="space-y-3">
                                {departments.map((dept) => {
                                    const Icon = iconMap[dept.icon] || FileText;
                                    return (
                                        <div key={dept.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted hover:bg-surface-muted/70 transition-colors">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: dept.color }}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-fg">{dept.label}</p>
                                                <p className="text-xs text-fg-muted">{dept.services.length} services</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Department Services — 2-column card grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {departments.map((dept, i) => {
                    const Icon = iconMap[dept.icon] || FileText;
                    return (
                        <motion.div key={dept.id} variants={cardAnim} custom={i + 2}>
                            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                                <CardContent>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: dept.color }}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-fg">{dept.label}</h3>
                                            <p className="text-sm text-fg-secondary mt-0.5">{dept.desc}</p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {dept.services.map((service) => (
                                                    <Link key={service} href="/citizen/complaints/new">
                                                        <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                                                            {service}
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
