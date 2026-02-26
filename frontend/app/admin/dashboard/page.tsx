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
import { getKPIs, getChartData } from "@/services/admin.service";
import { KPIData } from "@/types";
import { useGSAP } from "@/hooks/useGSAP";
import { useI18nStore } from "@/store/i18n.store";
import Link from "next/link";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-muted flex items-center justify-center animate-pulse" />
});

// Lazy load Recharts
const LazyBarChart = dynamic(
    () => import("recharts").then((mod) => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod;
        return function ChartComponent({ data }: { data: { month: string; filed: number; resolved: number }[] }) {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <YAxis tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "12px",
                                fontSize: 12,
                            }}
                        />
                        <Legend />
                        <Bar dataKey="filed" fill="#6366F1" radius={[4, 4, 0, 0]} name="Filed" />
                        <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                    </BarChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[300px] bg-surface-muted rounded-xl animate-pulse" /> }
);

const LazyPieChart = dynamic(
    () => import("recharts").then((mod) => {
        const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;
        return function PieComponent({ data }: { data: { name: string; value: number; color: string }[] }) {
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} dataKey="value">
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "12px",
                                fontSize: 12,
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[250px] bg-surface-muted rounded-xl animate-pulse" /> }
);

const kpiIcons: Record<string, React.ReactNode> = {
    FileText: <FileText className="h-5 w-5" />,
    CheckCircle: <CheckCircle className="h-5 w-5" />,
    Clock: <Clock className="h-5 w-5" />,
    ThumbsUp: <ThumbsUp className="h-5 w-5" />,
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.06, duration: 0.4, ease: [0, 0, 0.2, 1] as const },
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

    useEffect(() => {
        async function load() {
            try {
                const [k, c] = await Promise.all([getKPIs(), getChartData()]);
                setKpis(k);
                setChartData(c);
            } catch {
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    const gsapRef = useGSAP<HTMLDivElement>(".gsap-card", { y: 16, stagger: 0.06 });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (<div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />))}
                </div>
                <div className="h-80 rounded-2xl bg-surface border border-border animate-pulse" />
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
        <div ref={gsapRef} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg">{t("admin.dashboard")}</h1>
                    <p className="text-fg-secondary mt-1">{t("dashboard.overview")}</p>
                </div>
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t("admin.exportReport")}
                </Button>
            </div>

            {/* KPI Cards */}
            <motion.div initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div key={i} variants={fadeUp} custom={i}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-fg-secondary uppercase tracking-wider">{kpi.label}</p>
                                        <p className="text-2xl font-bold text-fg mt-1">{kpi.value}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {kpi.trend === "up" ? (
                                                <TrendingUp className="h-3 w-3 text-success-500" />
                                            ) : kpi.trend === "down" ? (
                                                <TrendingDown className="h-3 w-3 text-danger-500" />
                                            ) : (
                                                <Minus className="h-3 w-3 text-fg-muted" />
                                            )}
                                            <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-success-500" : kpi.trend === "down" ? "text-danger-500" : "text-fg-muted"}`}>
                                                {kpi.change > 0 ? "+" : ""}{kpi.change}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                        {kpiIcons[kpi.icon] || <FileText className="h-5 w-5" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Live Ward Map Widget */}
            <div className="gsap-card">
                <Card padding="none" className="overflow-hidden">
                    <CardContent className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-fg">{t("admin.wardMap")} (Live)</h2>
                        <Link href="/admin/map">
                            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                {t("common.viewAll")}
                            </Button>
                        </Link>
                    </CardContent>
                    <div className="h-[300px] relative">
                        <InteractiveMap
                            center={[28.6139, 77.2090]}
                            markers={chartData?.resolutionByWard.map((w, i) => {
                                // Map minimal ward data to markers
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
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 gsap-card">
                    <Card>
                        <CardContent>
                            <h2 className="text-lg font-semibold text-fg mb-4">{t("admin.complaintsOverTime")}</h2>
                            {chartData && <LazyBarChart data={chartData.complaintsOverTime} />}
                        </CardContent>
                    </Card>
                </div>

                {/* Pie Chart */}
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold text-fg mb-4">{t("admin.byDepartment")}</h2>
                        {chartData && <LazyPieChart data={chartData.byDepartment} />}
                        {/* Legend */}
                        <div className="space-y-2 mt-4">
                            {chartData?.byDepartment.map((dept) => (
                                <div key={dept.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                                        <span className="text-fg-secondary">{dept.name}</span>
                                    </div>
                                    <span className="font-medium text-fg">{dept.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Resolution by Ward */}
            <Card className="gsap-card">
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">{t("admin.resolutionByWard")}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {chartData?.resolutionByWard.map((ward) => (
                            <div key={ward.ward} className="text-center p-4 rounded-xl bg-surface-muted">
                                <p className="text-2xl font-bold" style={{ color: ward.rate >= 90 ? "#10B981" : ward.rate >= 80 ? "#F59E0B" : "#EF4444" }}>
                                    {ward.rate}%
                                </p>
                                <p className="text-xs text-fg-secondary mt-1">{ward.ward}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
