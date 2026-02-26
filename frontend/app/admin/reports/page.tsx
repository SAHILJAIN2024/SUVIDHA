"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Download, AlertCircle } from "lucide-react";
import { Card, CardContent, Button, Select } from "@/components/ui";
import { getChartData } from "@/services/admin.service";
import { getReportSummary, ReportSummary } from "@/services/ward.service";

const LazyBarChart = dynamic(
    () => import("recharts").then((mod) => {
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
        return function Chart({ data }: { data: { ward: string; rate: number }[] }) {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} layout="vertical" barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <YAxis dataKey="ward" type="category" tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} width={60} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: 12 }} />
                        <Bar dataKey="rate" fill="#6366F1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[350px] bg-surface-muted rounded-xl animate-pulse" /> }
);

const LazyLineChart = dynamic(
    () => import("recharts").then((mod) => {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod;
        return function Chart({ data }: { data: { month: string; filed: number; resolved: number }[] }) {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <YAxis tick={{ fontSize: 12, fill: "var(--color-fg-secondary)" }} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: 12 }} />
                        <Legend />
                        <Line type="monotone" dataKey="filed" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} name="Filed" />
                        <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Resolved" />
                    </LineChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false, loading: () => <div className="h-[350px] bg-surface-muted rounded-xl animate-pulse" /> }
);

export default function ReportsPage() {
    const [chartData, setChartData] = useState<{
        complaintsOverTime: { month: string; filed: number; resolved: number }[];
        resolutionByWard: { ward: string; rate: number }[];
    } | null>(null);
    const [summaryStats, setSummaryStats] = useState<ReportSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getChartData(), getReportSummary()])
            .then(([charts, summary]) => {
                setChartData(charts);
                setSummaryStats(summary);
                setLoading(false);
            })
            .catch(() => { setError("Failed to load reports"); setLoading(false); });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-surface-muted rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-surface border border-border animate-pulse" />)}
                </div>
                <div className="h-96 rounded-2xl bg-surface border border-border animate-pulse" />
                <div className="h-96 rounded-2xl bg-surface border border-border animate-pulse" />
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Reports & Analytics</h1>
                    <p className="text-fg-secondary mt-1">Comprehensive department performance reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        options={[
                            { value: "30d", label: "Last 30 Days" },
                            { value: "90d", label: "Last 90 Days" },
                            { value: "6m", label: "Last 6 Months" },
                            { value: "1y", label: "Last Year" },
                        ]}
                    />
                    <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export PDF</Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card>
                            <CardContent>
                                <p className="text-xs text-fg-secondary uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-fg mt-1">{stat.value}</p>
                                <p className="text-xs text-fg-muted mt-1">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Trend Chart */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Complaint Trends</h2>
                    {chartData && <LazyLineChart data={chartData.complaintsOverTime} />}
                </CardContent>
            </Card>

            {/* Ward Resolution */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-fg mb-4">Resolution Rate by Ward</h2>
                    {chartData && <LazyBarChart data={chartData.resolutionByWard} />}
                </CardContent>
            </Card>
        </div>
    );
}
