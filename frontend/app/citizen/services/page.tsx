"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Droplets, Route, Recycle, ArrowRight, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";

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
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   
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
                            
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2: Department Overview */}
                <motion.div variants={cardAnim} custom={1}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">Department Overview</h2>
                            
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            
        </motion.div>
    );
}
