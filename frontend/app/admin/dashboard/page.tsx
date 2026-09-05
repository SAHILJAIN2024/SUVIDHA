"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowRight,
    AlertCircle as AlertCircleIcon,
    GitBranch,
    Layers,
    ShieldCheck,
    XCircle,
    Landmark,
    Link2,
    RefreshCw,
    Plus,
    ScrollText,
} from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import type {
    KPIData,
    SimulationParameters,
    SimulationResult,
    GovernanceProposal,
    ParcelLedgerEntry,
    IntegrationStatus,
} from "@/types";

/* ------------------ Dynamic Imports ------------------ */

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-surface-muted flex items-center justify-center animate-pulse rounded-3xl">
            <Layers className="h-8 w-8 text-fg-muted animate-spin" />
        </div>
    ),
});

const LazyBarChart = dynamic(
    () =>
        import("recharts").then((mod) => {
            const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod;
            return function ChartComponent({
                data,
            }: {
                data: { year: string; agriLandLossPct: number; urbanExpansionPct: number }[];
            }) {
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="agriLandLossPct" name="Agri-Land Loss %" fill="#EF4444" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="urbanExpansionPct" name="Urban Expansion %" fill="#6366F1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            };
        }),
    { ssr: false }
);

const LazyPieChart = dynamic(
    () =>
        import("recharts").then((mod) => {
            const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;
            return function PieComponent({ data }: { data: { name: string; value: number; color: string }[] }) {
                return (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} dataKey="value">
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );
            };
        }),
    { ssr: false }
);

/* ------------------ Animations ------------------ */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardAnim = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }),
};

/* ------------------ Static config ------------------ */

const riskColor: Record<string, string> = {
    Low: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Moderate: "text-amber-600 bg-amber-50 border-amber-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    Severe: "text-rose-600 bg-rose-50 border-rose-200",
};

const integrationDot: Record<string, string> = {
    connected: "bg-emerald-500",
    degraded: "bg-amber-500",
    disconnected: "bg-rose-500",
};

const DEFAULT_BASELINE: SimulationParameters = {
    urban_expansion_pct: 8,
    population_growth_pct: 6,
    protected_land_constraint_pct: 25,
    infrastructure_growth_target_pct: 10,
};

/** Transparent, labelled-assumption projection model for client-side scenario preview.
 *  Server-side simulation (Section E) performs the authoritative statistical/ML run;
 *  this gives policymakers an instant, clearly-labelled indicative estimate. */
function runScenario(label: string, params: SimulationParameters): SimulationResult {
    const agriLandChange = -(params.urban_expansion_pct * 0.6 - params.protected_land_constraint_pct * 0.12);
    const infraDemandIndex = params.population_growth_pct * 1.4 + params.infrastructure_growth_target_pct * 0.8;
    const populationAffected = Math.round(params.urban_expansion_pct * params.population_growth_pct * 4200);
    const riskScore = params.urban_expansion_pct * 1.1 - params.protected_land_constraint_pct * 0.5 + params.population_growth_pct * 0.6;

    let climate_risk_rating: SimulationResult["climate_risk_rating"] = "Low";
    if (riskScore > 18) climate_risk_rating = "Severe";
    else if (riskScore > 10) climate_risk_rating = "High";
    else if (riskScore > 3) climate_risk_rating = "Moderate";

    return {
        label,
        parameters: params,
        projected_agri_land_change_pct: Math.round(agriLandChange * 10) / 10,
        projected_infra_demand_index: Math.round(infraDemandIndex * 10) / 10,
        population_affected: populationAffected,
        climate_risk_rating,
    };
}

/* ═══════════════════════════════════════════════════════════
   Policy Simulations Engine widget (Section E)
   ═══════════════════════════════════════════════════════════ */
function PolicySimulationEngine() {
    const [params, setParams] = useState<SimulationParameters>({
        urban_expansion_pct: 12,
        population_growth_pct: 7,
        protected_land_constraint_pct: 20,
        infrastructure_growth_target_pct: 15,
    });
    const [scenarios, setScenarios] = useState<SimulationResult[]>([runScenario("Baseline", DEFAULT_BASELINE)]);
    const [running, setRunning] = useState(false);

    const update = (key: keyof SimulationParameters, value: number) =>
        setParams((p) => ({ ...p, [key]: value }));

    const runSimulation = () => {
        setRunning(true);
        setTimeout(() => {
            setScenarios((prev) => [
                ...prev,
                runScenario(`Policy ${String.fromCharCode(65 + prev.length - 1)}`, params),
            ]);
            setRunning(false);
        }, 500);
    };

    const resetScenarios = () => setScenarios([runScenario("Baseline", DEFAULT_BASELINE)]);

    const sliders: { key: keyof SimulationParameters; label: string; max: number; unit: string }[] = [
        { key: "urban_expansion_pct", label: "Proposed Urban Expansion", max: 50, unit: "%" },
        { key: "population_growth_pct", label: "Expected Population Growth", max: 20, unit: "%" },
        { key: "protected_land_constraint_pct", label: "Protected-Land Constraint", max: 60, unit: "%" },
        { key: "infrastructure_growth_target_pct", label: "Infrastructure Growth Target", max: 40, unit: "%" },
    ];

    return (
        <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
            <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-fg flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-primary-600" /> Policy Simulation Engine
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                        Assumption-Labelled
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-fg-secondary mb-6">
                    Model a proposed reform before implementation. Runs against historical/regional data using transparent
                    statistical models — not a guarantee of real-world outcomes.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Scenario builder */}
                    <div className="space-y-5">
                        {sliders.map((s) => (
                            <div key={s.key}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs sm:text-sm font-semibold text-fg">{s.label}</label>
                                    <span className="text-xs sm:text-sm font-bold text-primary-600">
                                        {params[s.key]}
                                        {s.unit}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={s.max}
                                    value={params[s.key]}
                                    onChange={(e) => update(s.key, Number(e.target.value))}
                                    className="w-full accent-primary-600"
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="primary"
                                onClick={runSimulation}
                                disabled={running}
                                leftIcon={
                                    running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />
                                }
                                className="flex-1"
                            >
                                {running ? "Running Scenario…" : "Run Scenario"}
                            </Button>
                            <Button variant="outline" onClick={resetScenarios}>
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Scenario comparison table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-fg-muted uppercase text-[10px] tracking-wider">
                                    <th className="text-left font-bold px-2">Scenario</th>
                                    <th className="text-right font-bold px-2">Agri-Land Δ</th>
                                    <th className="text-right font-bold px-2">Infra Demand</th>
                                    <th className="text-right font-bold px-2">Pop. Affected</th>
                                    <th className="text-right font-bold px-2">Climate Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence initial={false}>
                                    {scenarios.map((s, i) => (
                                        <motion.tr
                                            key={s.label + i}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-surface-muted/40"
                                        >
                                            <td className="px-2 py-2 rounded-l-xl font-bold text-fg">{s.label}</td>
                                            <td
                                                className={`px-2 py-2 text-right font-semibold ${
                                                    s.projected_agri_land_change_pct < 0
                                                        ? "text-rose-600"
                                                        : "text-emerald-600"
                                                }`}
                                            >
                                                {s.projected_agri_land_change_pct}%
                                            </td>
                                            <td className="px-2 py-2 text-right text-fg-secondary">
                                                {s.projected_infra_demand_index}
                                            </td>
                                            <td className="px-2 py-2 text-right text-fg-secondary">
                                                {s.population_affected.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-2 py-2 rounded-r-xl text-right">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        riskColor[s.climate_risk_rating]
                                                    }`}
                                                >
                                                    {s.climate_risk_rating}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/* ═══════════════════════════════════════════════════════════
   Parcel Ledger Governance Approval Queue (Section G, H)
   ═══════════════════════════════════════════════════════════ */
function GovernanceApprovalQueue({
    proposals,
    onDecision,
}: {
    proposals: GovernanceProposal[];
    onDecision: (id: number, decision: "approved" | "rejected") => void;
}) {
    const pending = proposals.filter((p) => p.status === "pending_review");
    const decided = proposals.filter((p) => p.status !== "pending_review").slice(0, 4);

    return (
        <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
            <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-fg flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary-600" /> Parcel Ledger — Governance Approval Queue
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                        {pending.length} pending
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-fg-secondary mb-6">
                    AI/rule-based logic may flag and prioritise proposals, but only an authorised institutional workflow
                    approves a change to the ERC-721/ERC-1155 ledger. Nothing is written unilaterally.
                </p>

                <div className="space-y-3">
                    {pending.length === 0 ? (
                        <div className="text-center py-8 text-sm text-fg-secondary">No proposals awaiting review.</div>
                    ) : (
                        pending.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-border/60 p-4 sm:p-5 bg-surface-muted/30"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                                                {p.rights_class}
                                            </span>
                                            <span className="text-[10px] font-mono text-fg-muted">{p.proposal_id}</span>
                                            <span className="text-[10px] font-mono text-fg-muted">
                                                ULPIN {p.ulpin}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-fg">{p.summary}</p>
                                        <p className="text-xs text-fg-secondary mt-1">
                                            Submitted by {p.submitted_by} · Requires: {p.reviewer_role} ·{" "}
                                            {new Date(p.submitted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                            leftIcon={<XCircle className="h-3.5 w-3.5" />}
                                            onClick={() => onDecision(p.id, "rejected")}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
                                            onClick={() => onDecision(p.id, "approved")}
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {decided.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
                            Recently decided
                        </p>
                        <div className="space-y-2">
                            {decided.map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-fg-secondary truncate">
                                        {p.proposal_id} · {p.rights_class} · ULPIN {p.ulpin}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                                            p.status === "approved"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-rose-50 text-rose-700 border-rose-200"
                                        }`}
                                    >
                                        {p.status === "approved" ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* ═══════════════════════════════════════════════════════════
   Tamper-evident audit trail preview (Section H, I)
   ═══════════════════════════════════════════════════════════ */
function AuditTrailPreview({ entries }: { entries: ParcelLedgerEntry[] }) {
    return (
        <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
            <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ScrollText className="h-5 w-5 text-primary-600" /> Tamper-Evident Audit Trail
                </h2>
                <div className="space-y-3">
                    {entries.length === 0 ? (
                        <p className="text-sm text-fg-secondary text-center py-6">
                            No ledger activity recorded yet.
                        </p>
                    ) : (
                        entries.map((e) => (
                            <div key={e.id} className="flex items-start gap-3 text-xs sm:text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-fg font-medium truncate">{e.event}</p>
                                    <p className="text-fg-muted text-[11px] font-mono truncate">
                                        ULPIN {e.ulpin} · {e.token_standard}
                                        {e.rights_class ? ` · ${e.rights_class}` : ""} · tx {e.tx_hash.slice(0, 10)}…
                                    </p>
                                </div>
                                <span className="text-[11px] text-fg-muted shrink-0">
                                    {new Date(e.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

/* ═══════════════════════════════════════════════════════════
   Government Data Integration status panel (Section F)
   ═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   Government Data Integration status panel (Section F)
   ═══════════════════════════════════════════════════════════ */
function IntegrationStatusPanel({ integrations }: { integrations: IntegrationStatus[] }) {
    return (
        <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
            <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary-600" /> Government Data Integration
                </h2>
                <div className="space-y-3">
                    {integrations.map((i) => (
                        <div key={i.name} className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${integrationDot[i.status]}`} />
                                <span className="font-semibold text-fg">{i.name}</span>
                            </div>
                            <span className="text-fg-muted text-[11px]">
                                Synced {i.formatted_date}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
/* ═══════════════════════════════════════════════════════════
   HARDCODED DATA - No backend dependency
   ═══════════════════════════════════════════════════════════ */

const HARDCODED_KPIS: KPIData[] = [
    { label: "Land-Use Change (YoY)", value: "12.4%", change: 2.3, trend: "up", icon: "Layers" },
    { label: "Urbanisation Rate", value: "18.7%", change: 1.8, trend: "up", icon: "TrendingUp" },
    { label: "Agri-Land Loss", value: "−8.2%", change: -1.4, trend: "down", icon: "TrendingDown" },
    {
        label: "Climate-Vulnerability Index",
        value: "64.3",
        change: -0.8,
        trend: "down",
        icon: "AlertCircle",
    },
    { label: "Active Land Disputes", value: "1,247", change: -5.2, trend: "down", icon: "FileText" },
    {
        label: "Compensation Claims Processed",
        value: "3,891",
        change: 12.6,
        trend: "up",
        icon: "CheckCircle",
    },
];

const HARDCODED_CHART_DATA = {
    landUseOverTime: [
        { year: "2018", agriLandLossPct: 4.2, urbanExpansionPct: 6.8 },
        { year: "2019", agriLandLossPct: 5.1, urbanExpansionPct: 7.3 },
        { year: "2020", agriLandLossPct: 6.3, urbanExpansionPct: 8.1 },
        { year: "2021", agriLandLossPct: 7.8, urbanExpansionPct: 9.4 },
        { year: "2022", agriLandLossPct: 8.2, urbanExpansionPct: 10.2 },
        { year: "2023", agriLandLossPct: 9.1, urbanExpansionPct: 11.7 },
        { year: "2024", agriLandLossPct: 10.4, urbanExpansionPct: 13.2 },
    ],
    landCategoryBreakdown: [
        { name: "Agricultural", value: 42, color: "#10B981" },
        { name: "Residential", value: 28, color: "#6366F1" },
        { name: "Commercial", value: 15, color: "#F59E0B" },
        { name: "Industrial", value: 8, color: "#EF4444" },
        { name: "Protected", value: 7, color: "#8B5CF6" },
    ],
};

const HARDCODED_PROPOSALS: GovernanceProposal[] = [
    {
        id: 1,
        proposal_id: "PROP-2024-001",
        ulpin: "ULPIN-IN-MH-0234-5678",
        rights_class: "full_ownership",
        summary: "Transfer of agricultural land to residential zone in Ward 12, Pune",
        status: "pending_review",
        submitted_by: "District Collector Office",
        reviewer_role: "State Land Commissioner",
        submitted_at: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        proposal_id: "PROP-2024-002",
        ulpin: "ULPIN-IN-KA-8765-4321",
        rights_class: "leasehold",
        summary: "Conversion of leasehold to freehold for industrial plot, Bangalore",
        status: "pending_review",
        submitted_by: "Karnataka Industrial Area Board",
        reviewer_role: "Regional Administrator",
        submitted_at: "2024-01-18T14:20:00Z",
    },
    {
        id: 3,
        proposal_id: "PROP-2024-003",
        ulpin: "ULPIN-IN-TN-1122-3344",
        rights_class: "common_rights",
        summary: "Allocation of common grazing land for community center, Chennai",
        status: "pending_review",
        submitted_by: "Chennai Municipal Corporation",
        reviewer_role: "State Land Commissioner",
        submitted_at: "2024-01-20T09:15:00Z",
    },
    {
        id: 4,
        proposal_id: "PROP-2023-089",
        ulpin: "ULPIN-IN-DL-5566-7788",
        rights_class: "full_ownership",
        summary: "Land acquisition for metro expansion, Delhi",
        status: "approved",
        submitted_by: "Delhi Metro Rail Corporation",
        reviewer_role: "Central Land Authority",
        submitted_at: "2023-12-10T11:00:00Z",
        decided_at: "2024-01-05T16:30:00Z",
        decided_by: "Central Land Authority",
    },
    {
        id: 5,
        proposal_id: "PROP-2023-092",
        ulpin: "ULPIN-IN-GJ-9988-7766",
        rights_class: "leasehold",
        summary: "Industrial zone expansion, Ahmedabad",
        status: "rejected",
        submitted_by: "Gujarat Industrial Development Corp",
        reviewer_role: "State Land Commissioner",
        submitted_at: "2023-12-15T13:45:00Z",
        decided_at: "2024-01-08T10:20:00Z",
        decided_by: "State Land Commissioner",
    },
];

const HARDCODED_LEDGER_ENTRIES: ParcelLedgerEntry[] = [
    {
        id: 1,
        ulpin: "ULPIN-IN-MH-0234-5678",
        token_standard: "ERC-721",
        rights_class: "Full Ownership",
        event: "Ownership Transfer",
        tx_hash: "0x7a8f9c3e2d1b5a4f6e8c9d0a1b2c3d4e5f6a7b8c",
        timestamp: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        ulpin: "ULPIN-IN-KA-8765-4321",
        token_standard: "ERC-1155",
        rights_class: "leasehold",
        event: "Lease Renewal",
        tx_hash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
        timestamp: "2024-01-14T15:20:00Z",
    },
    {
        id: 3,
        ulpin: "ULPIN-IN-TN-1122-3344",
        token_standard: "ERC-721",
        rights_class: "common_rights",
        event: "Rights Allocation",
        tx_hash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
        timestamp: "2024-01-13T09:45:00Z",
    },
    {
        id: 4,
        ulpin: "ULPIN-IN-DL-5566-7788",
        token_standard: "ERC-721",
        rights_class: "full_ownership",
        event: "Government Acquisition",
        tx_hash: "0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
        timestamp: "2024-01-12T11:30:00Z",
    },
    {
        id: 5,
        ulpin: "ULPIN-IN-GJ-9988-7766",
        token_standard: "ERC-1155",
        rights_class: "Leasehold",
        event: "Zone Reclassification",
        tx_hash: "0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c",
        timestamp: "2024-01-11T14:15:00Z",
    },
];

const HARDCODED_INTEGRATIONS: IntegrationStatus[] = [
    {
        name: "National Land Records Modernisation",
        status: "connected",
        last_sync: "2024-01-20T08:00:00Z",
        formatted_date: "20/01/2024", // Pre-formatted
    },
    {
        name: "State Revenue Department",
        status: "connected",
        last_sync: "2024-01-20T07:30:00Z",
        formatted_date: "20/01/2024",
    },
    {
        name: "Municipal Corporation GIS",
        status: "degraded",
        last_sync: "2024-01-19T18:00:00Z",
        formatted_date: "19/01/2024",
    },
    {
        name: "Aadhaar Authentication Service",
        status: "connected",
        last_sync: "2024-01-20T08:15:00Z",
        formatted_date: "20/01/2024",
    },
    {
        name: "Banking Integration (e-Stamp)",
        status: "disconnected",
        last_sync: "2024-01-15T12:00:00Z",
        formatted_date: "15/01/2024",
    },
];

const HARDCODED_MAP_MARKERS = [
    { lat: 28.6139, lng: 77.209, label: "Delhi", complaints: 234, status: "high" as const },
    { lat: 19.076, lng: 72.8777, label: "Mumbai", complaints: 189, status: "high" as const },
    { lat: 12.9716, lng: 77.5946, label: "Bangalore", complaints: 156, status: "medium" as const },
    { lat: 13.0827, lng: 80.2707, label: "Chennai", complaints: 142, status: "medium" as const },
    { lat: 22.5726, lng: 88.3639, label: "Kolkata", complaints: 178, status: "high" as const },
    { lat: 18.5204, lng: 73.8567, label: "Pune", complaints: 98, status: "low" as const },
];

/* ═══════════════════════════════════════════════════════════
   Main: Government / Administrator Decision-Support Console
   ═══════════════════════════════════════════════════════════ */
export default function DecisionSupportConsole() {
    // Use hardcoded data directly - no loading state needed
    const kpis = HARDCODED_KPIS;
    const chartData = HARDCODED_CHART_DATA;
    const [proposals, setProposals] = useState<GovernanceProposal[]>(HARDCODED_PROPOSALS);
    const ledgerEntries = HARDCODED_LEDGER_ENTRIES;
    const integrations = HARDCODED_INTEGRATIONS;
    const mapMarkers = HARDCODED_MAP_MARKERS;

    const handleDecision = (id: number, decision: "approved" | "rejected") => {
        setProposals((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                          ...p,
                          status: decision,
                          decided_at: new Date().toISOString(),
                          decided_by: "Admin User",
                      }
                    : p
            )
        );
    };

    const kpiIcon: Record<string, React.ReactNode> = {
        Layers: <Layers className="h-5 w-5" />,
        TrendingUp: <TrendingUp className="h-5 w-5" />,
        TrendingDown: <TrendingDown className="h-5 w-5" />,
        AlertCircle: <AlertCircleIcon className="h-5 w-5" />,
        FileText: <FileText className="h-5 w-5" />,
        CheckCircle: <CheckCircle className="h-5 w-5" />,
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-12 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto relative"
        >
            {/* Header */}
            <motion.div variants={cardAnim} custom={0} className="flex flex-col sm:flex-row sm:justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold">
                        <span className="text-fg">Decision-Support </span>
                        <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                            Console
                        </span>
                    </h1>
                    <p className="mt-3 text-fg-secondary flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-primary-600" /> Government Official / Administrator ·
                        Role-Based Access (Section L)
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="shadow-lg hover:-translate-y-1 transition"
                >
                    Export Policy Brief
                </Button>
            </motion.div>

            {/* KPI Cards (Section D — Analytics & Decision-Support indicators) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {kpis.map((kpi, i) => (
                    <motion.div key={i} variants={cardAnim} custom={i + 1}>
                        <Card className="rounded-3xl bg-white/70 backdrop-blur-xl border hover:shadow-2xl transition h-full">
                            <CardContent className="p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-2 text-primary-500">
                                    {kpiIcon[kpi.icon] ?? <Layers className="h-5 w-5" />}
                                </div>
                                <p className="text-[11px] uppercase text-fg-secondary font-semibold tracking-widest leading-tight">
                                    {kpi.label}
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold mt-2 bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                                    {kpi.value}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 text-xs">
                                    {kpi.trend === "up" ? (
                                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                    ) : kpi.trend === "down" ? (
                                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                                    ) : (
                                        <Minus className="h-3.5 w-3.5 text-gray-400" />
                                    )}
                                    {kpi.change > 0 ? "+" : ""}
                                    {kpi.change}%
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Policy Simulation Engine — full width, centerpiece */}
            <motion.div variants={cardAnim} custom={2}>
                <PolicySimulationEngine />
            </motion.div>

            {/* GIS + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={cardAnim} custom={3}>
                    <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
                        <CardContent className="p-6 border-b">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary-600" /> GIS Explorer — India → State → District
                                → Land Category → Year
                            </h2>
                        </CardContent>
                        <div className="h-[420px]">
                            <InteractiveMap center={[22.9734, 78.6569]} markers={mapMarkers} />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={cardAnim} custom={4}>
                    <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-6">Land-Use Change Over Time</h2>
                            <LazyBarChart data={chartData.landUseOverTime} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardAnim} custom={5}>
                    <Card className="rounded-3xl backdrop-blur-xl border hover:shadow-xl transition">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-6">Land Category Breakdown</h2>
                            <LazyPieChart data={chartData.landCategoryBreakdown} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardAnim} custom={6}>
                    <IntegrationStatusPanel integrations={integrations} />
                </motion.div>
            </div>

            {/* Governance Approval Queue + Audit Trail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={cardAnim} custom={7} className="lg:col-span-2">
                    <GovernanceApprovalQueue proposals={proposals} onDecision={handleDecision} />
                </motion.div>
                <motion.div variants={cardAnim} custom={8}>
                    <AuditTrailPreview entries={ledgerEntries} />
                </motion.div>
            </div>
        </motion.div>
    );
}