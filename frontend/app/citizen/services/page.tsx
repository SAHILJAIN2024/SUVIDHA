"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Droplets, Route, Recycle, ArrowRight, FileText, CreditCard, Phone, HelpCircle, Plug, ShieldCheck } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";

const departments = [
    { id: "electricity", label: "Electricity", icon: Zap, color: "#F59E0B", desc: "Report outages, faulty meters, streetlights", services: ["Report Outage", "Meter Issue", "New Connection"] },
    { id: "water", label: "Water Supply", icon: Droplets, color: "#3B82F6", desc: "Leaks, supply disruptions, water quality", services: ["Report Leak", "Low Pressure", "Quality Complaint"] },
    { id: "roads", label: "Roads & Infra", icon: Route, color: "#8B5CF6", desc: "Potholes, damaged signage, construction", services: ["Report Pothole", "Damaged Sign", "Illegal Dumping"] },
    { id: "sanitation", label: "Sanitation", icon: Recycle, color: "#10B981", desc: "Garbage, drainage, public cleanliness", services: ["Missed Pickup", "Clogged Drain", "Bin Request"] },
];

const quickActions = [
    { label: "File Complaint", icon: FileText, href: "/citizen/complaints/new", color: "bg-primary-600" },
    { label: "Request Connection", icon: Plug, href: "/citizen/services/request-connection", color: "bg-amber-600" },
    { label: "Pay Bills", icon: CreditCard, href: "/citizen/bills", color: "bg-accent-600" },
    { label: "Verify Documents", icon: ShieldCheck, href: "/citizen/documents", color: "bg-emerald-600" },
    { label: "Helpline", icon: Phone, href: "#", color: "bg-success-600" },
    { label: "FAQs", icon: HelpCircle, href: "#", color: "bg-blue-600" },
];

export default function ServicesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-fg">Services</h1>
                <p className="text-fg-secondary mt-1">Browse and access civic services by department</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((action, i) => (
                    <Link key={i} href={action.href}>
                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-border hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-fg">{action.label}</span>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Department Services */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-fg">By Department</h2>
                {departments.map((dept, i) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                                        style={{ backgroundColor: dept.color }}
                                    >
                                        <dept.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-fg">{dept.label}</h3>
                                        <p className="text-sm text-fg-secondary mt-0.5">{dept.desc}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {dept.services.map((service) => (
                                                <Link key={service} href={`/citizen/complaints/new`}>
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
                ))}
            </div>
        </div>
    );
}
