"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle,
    Clock,
    ThumbsUp,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowRight,
    AlertCircle as AlertCircleIcon,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";

import { KPIData } from "@/types";
import { useI18nStore } from "@/store/i18n.store";
import Link from "next/link";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-muted flex items-center justify-center animate-pulse" />,
});

const LazyBarChart = dynamic(
    () => import("recharts").then((mod) => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod;
        return function ChartComponent({ data }: { data: { month: string; filed: number; resolved: number }[] }) {
            return (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <YAxis tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: 12 }} />
                        <Legend />
                        <Bar dataKey="filed" fill="#6366F1" radius={[4, 4, 0, 0]} name="Filed" />
                        <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                    </BarChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[280px] bg-surface-muted rounded-xl animate-pulse" /> }
);

const LazyPieChart = dynamic(
    () => import("recharts").then((mod) => {
        const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;
        return function PieComponent({ data }: { data: { name: string; value: number; color: string }[] }) {
            return (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4} dataKey="value">
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[220px] bg-surface-muted rounded-xl animate-pulse" /> }
);

const kpiIcons: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-5 w-5" />,
    CheckCircle: <CheckCircle className="h-5 w-5" />,
    Clock: <Clock className="h-5 w-5" />,
    ThumbsUp: <ThumbsUp className="h-5 w-5" />,
};

const kpiGradients: Record<string, string> = {
    FileText: "from-blue-500 to-indigo-600",
    CheckCircle: "from-emerald-500 to-teal-600",
    Clock: "from-amber-500 to-orange-600",
    ThumbsUp: "from-violet-500 to-purple-600",
};

const kpiShadows: Record<string, string> = {
    FileText: "shadow-blue-500/30",
    CheckCircle: "shadow-emerald-500/30",
    Clock: "shadow-amber-500/30",
    ThumbsUp: "shadow-violet-500/30",
};

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

export default function AdminDashboard() {
    const [kpis, setKpis] = useState<KPIData[]>([]);
    const [chartData, setChartData] = useState<{
        complaintsOverTime: { month: string; filed: number; resolved: number }[];
        byDepartment: { name: string; value: number; color: string }[];
        resolutionByWard: { ward: string; rate: number }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useI18nStore();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (<div key={i} className="h-28 rounded-2xl bg-surface border border-border/60 animate-pulse" />))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (<div key={i} className="h-80 rounded-2xl bg-surface border border-border/60 animate-pulse" />))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <AlertCircleIcon className="h-10 w-10 text-danger-500 mx-auto mb-3" />
                <p className="text-fg-secondary">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 p-4 md:p-6 lg:p-8 relative">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* Header */}
            <motion.div variants={cardAnim} custom={0} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                        {t("admin.dashboard").split(" ")[0]}{" "}
                        <span className="text-primary-600">{t("admin.dashboard").split(" ").slice(1).join(" ") || "Dashboard"}</span>
                    </h1>
                    <p className="text-fg-secondary mt-1 text-sm">{t("dashboard.overview")}</p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    {t("admin.exportReport")}
                </Button>
            </motion.div>

            {/* KPI Cards — 2x2 grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <motion.div key={i} variants={cardAnim} custom={i + 1} whileHover={{ y: -4, scale: 1.01 }}>
                        <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                            <CardContent className="p-5 sm:p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-fg-secondary uppercase tracking-wider font-semibold">{kpi.label}</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold mt-1 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                            {kpi.value}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            {kpi.trend === "up" ? (
                                                <TrendingUp className="h-3.5 w-3.5 text-success-500" />
                                            ) : kpi.trend === "down" ? (
                                                <TrendingDown className="h-3.5 w-3.5 text-danger-500" />
                                            ) : (
                                                <Minus className="h-3.5 w-3.5 text-fg-muted" />
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${kpi.trend === "up"
                                                    ? "bg-success-50 text-success-600"
                                                    : kpi.trend === "down"
                                                        ? "bg-danger-50 text-danger-600"
                                                        : "bg-surface-muted text-fg-muted"
                                                }`}>
                                                {kpi.change > 0 ? "+" : ""}{kpi.change}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${kpiGradients[kpi.icon] || "from-primary-500 to-primary-600"} flex items-center justify-center text-white shadow-lg ${kpiShadows[kpi.icon] || "shadow-primary-500/30"}`}>
                                        {kpiIcons[kpi.icon] || <FileText className="h-5 w-5" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ── Main Content: 2-Column Card Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Live Ward Map */}
                <motion.div variants={cardAnim} custom={5} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card padding="none" className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between bg-surface/50">
                            <h2 className="text-lg font-bold text-fg">
                                {t("admin.wardMap")} <span className="text-primary-600">(Live)</span>
                            </h2>
                            <Link href="/admin/map">
                                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />} className="hover:bg-primary-50 hover:text-primary-600 transition-all">
                                    {t("common.viewAll")}
                                </Button>
                            </Link>
                        </CardContent>
                        <div className="h-[350px] relative">
                            <InteractiveMap
                                center={[28.6139, 77.2090]}
                                markers={chartData?.resolutionByWard.map((w, i) => {
                                    const mockCoords = [
                                        [28.6328, 77.2197], [28.6139, 77.2090], [28.5932, 77.2215],
                                        [28.5623, 77.1852], [28.4595, 77.0266], [28.7041, 77.1025]
                                    ];
                                    return {
                                        lat: mockCoords[i % 6][0],
                                        lng: mockCoords[i % 6][1],
                                        label: w.ward,
                                        complaints: Math.floor(Math.random() * 50),
                                        status: w.rate < 80 ? 'high' : w.rate < 90 ? 'medium' : 'low'
                                    };
                                }) || []}
                            />
                        </div>
                    </Card>
                </motion.div>

                {/* Card 2: Complaints Over Time — Bar Chart */}
                <motion.div variants={cardAnim} custom={6} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-fg mb-5">
                                {t("admin.complaintsOverTime").split(" ")[0]}{" "}
                                <span className="text-primary-600">{t("admin.complaintsOverTime").split(" ").slice(1).join(" ")}</span>
                            </h2>
                            <div className="w-full">
                                {chartData && <LazyBarChart data={chartData.complaintsOverTime} />}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 3: By Department — Pie Chart */}
                <motion.div variants={cardAnim} custom={7} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-fg mb-5">
                                {t("admin.byDepartment").split(" ")[0]}{" "}
                                <span className="text-primary-600">{t("admin.byDepartment").split(" ").slice(1).join(" ")}</span>
                            </h2>
                            <div className="flex flex-col items-center w-full">
                                {chartData && <LazyPieChart data={chartData.byDepartment} />}
                                <div className="space-y-3 mt-4 w-full px-2">
                                    {chartData?.byDepartment.map((dept) => (
                                        <div key={dept.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: dept.color }} />
                                                <span className="text-fg-secondary tracking-tight font-medium">{dept.name}</span>
                                            </div>
                                            <span className="font-bold text-fg">{dept.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 4: Resolution by Ward */}
                <motion.div variants={cardAnim} custom={8} whileHover={{ y: -4, scale: 1.01 }}>
                    <Card className="rounded-2xl sm:rounded-3xl border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
                        <CardContent className="p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-fg mb-5">
                                {t("admin.resolutionByWard").split(" ")[0]}{" "}
                                <span className="text-primary-600">{t("admin.resolutionByWard").split(" ").slice(1).join(" ")}</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {chartData?.resolutionByWard.map((ward) => (
                                    <div
                                        key={ward.ward}
                                        className="text-center p-5 rounded-2xl bg-surface-muted/50 border border-border/40 hover:border-primary-500/30 hover:shadow-md transition-all duration-300"
                                    >
                                        <span className={`inline-block px-3 py-1 rounded-full text-lg sm:text-xl font-extrabold ${ward.rate >= 90
                                                ? "bg-emerald-50 text-emerald-600"
                                                : ward.rate >= 80
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}>
                                            {ward.rate}%
                                        </span>
                                        <p className="text-xs text-fg-secondary mt-2 font-semibold uppercase tracking-wider">{ward.ward}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
