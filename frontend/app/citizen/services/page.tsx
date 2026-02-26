"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Droplets, Route, Recycle, ArrowRight, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { getDepartments, getQuickActions, DepartmentInfo, QuickAction } from "@/services/ward.service";
import { useGSAP } from "@/hooks/useGSAP";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Zap, Droplets, Route, Recycle, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck,
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
        const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", { y: 16, stagger: 0.05 });

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-32 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />)}
                </div>
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />)}
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
        <div ref={gsapRef} className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-fg">Services</h1>
                <p className="text-fg-secondary mt-1">Browse and access civic services by department</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((action, i) => {
                    const Icon = iconMap[action.icon] || FileText;
                    return (
                        <Link key={i} href={action.href}>
                            <motion.div
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-border hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-fg">{action.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Department Services */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-fg">By Department</h2>
                {departments.map((dept, i) => {
                    const Icon = iconMap[dept.icon] || FileText;
                    return (
                        <motion.div key={dept.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Card className="hover:shadow-md transition-shadow">
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
        </div>
    );
}
