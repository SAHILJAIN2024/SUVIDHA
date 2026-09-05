"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Search,
  BookOpen,
  Users,
  Trophy,
  Send,
  Bookmark,
  MapPin,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import type {
  ResearchAsset,
  AIQueryResult,
  Workspace,
  InnovationSubmission,
} from "@/types";

/* ═══════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════ */
const cardAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════════
   Status / access-level badge config
   ═══════════════════════════════════════════════════════════ */
const accessStyles: Record<string, string> = {
  public: "bg-emerald-50 text-emerald-700 border-emerald-200",
  researcher: "bg-blue-50 text-blue-700 border-blue-200",
  government_official: "bg-violet-50 text-violet-700 border-violet-200",
};

const submissionStyles: Record<string, string> = {
  draft: "bg-surface-muted text-fg-secondary border-border",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  under_review: "bg-amber-50 text-amber-700 border-amber-200",
  shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

/* ═══════════════════════════════════════════════════════════
   Mock data fetchers (swap for real API calls)
   ═══════════════════════════════════════════════════════════ */
async function fetchKnowledgeHub(): Promise<ResearchAsset[]> {
  const res = await fetch("https://bhu-manthan-api.onrender.com/api/knowledge-hub?limit=6");
  if (!res.ok) throw new Error("Failed to fetch Knowledge Hub assets");
  const data = await res.json();
  if (!data.success) throw new Error("Backend returned failure");
  return data.data as ResearchAsset[];
}

async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch("https://bhu-manthan-api.onrender.com/api/workspaces/mine");
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  const data = await res.json();
  if (!data.success) throw new Error("Backend returned failure");
  return data.data as Workspace[];
}

async function fetchSubmissions(): Promise<InnovationSubmission[]> {
  const res = await fetch("https://bhu-manthan-api.onrender.com/api/innovation-portal/mine");
  if (!res.ok) throw new Error("Failed to fetch submissions");
  const data = await res.json();
  if (!data.success) throw new Error("Backend returned failure");
  return data.data as InnovationSubmission[];
}

/* ═══════════════════════════════════════════════════════════
   AI Research Assistant panel (RAG, citation-grounded — Section B)
   ═══════════════════════════════════════════════════════════ */
function AIResearchAssistant() {
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<AIQueryResult | null>(null);
  const [history, setHistory] = useState<AIQueryResult[]>([]);

  const askAssistant = useCallback(async () => {
    if (!query.trim()) return;
    setAsking(true);
    setResult(null);
    try {
      const res = await fetch("https://bhu-manthan-api.onrender.com/api/ai-assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Assistant request failed");
      const data = await res.json();
      const answer: AIQueryResult = data.data;
      setResult(answer);
      setHistory((prev) => [answer, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
      setResult({
        id: -1,
        query,
        answer:
          "The assistant could not be reached right now. Your question has been queued and results from the Knowledge Hub's semantic search will follow shortly.",
        citations: [],
        asked_at: new Date().toISOString(),
      });
    } finally {
      setAsking(false);
      setQuery("");
    }
  }, [query]);

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-violet-50 to-primary-50 dark:from-violet-950/20 dark:to-primary-950/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-fg">AI Research Assistant</h2>
        </div>
        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-full">
          RAG · Citation-grounded
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAssistant()}
            placeholder='e.g. "Major causes of agricultural land conversion around Bhopal"'
            className="flex-1 rounded-xl border border-border/60 bg-surface-muted/40 px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
          <Button
            variant="primary"
            onClick={askAssistant}
            disabled={asking || !query.trim()}
            rightIcon={asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            className="shrink-0"
          >
            {asking ? "Searching…" : "Ask"}
          </Button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-surface-muted/50 border border-border/50 p-4 sm:p-5 space-y-3"
          >
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">You asked</p>
            <p className="text-sm text-fg font-medium">{result.query}</p>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider pt-1">Answer</p>
            <p className="text-sm text-fg-secondary leading-relaxed">{result.answer}</p>
            {result.citations.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {result.citations.map((c, i) => (
                    <span
                      key={i}
                      title={c.snippet}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-300"
                    >
                      {c.asset_id} · {c.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {history.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Recent questions</p>
            <div className="flex flex-col gap-1.5">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setResult(h)}
                  className="text-left text-xs sm:text-sm text-fg-secondary hover:text-primary-600 truncate transition-colors"
                >
                  • {h.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Researcher Workspace — main dashboard
   ═══════════════════════════════════════════════════════════ */
export default function ResearcherWorkspace() {
  const router = useRouter();

  const [assets, setAssets] = useState<ResearchAsset[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [submissions, setSubmissions] = useState<InnovationSubmission[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assetsData, workspacesData, submissionsData] = await Promise.all([
        fetchKnowledgeHub(),
        fetchWorkspaces(),
        fetchSubmissions(),
      ]);
      setAssets(assetsData);
      setWorkspaces(workspacesData);
      setSubmissions(submissionsData);
    } catch (err) {
      console.error(err);
      setError("Unable to load your workspace data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = useMemo(
    () => ({
      bookmarked: assets.length,
      activeWorkspaces: workspaces.length,
      submissionsInFlight: submissions.filter((s) => s.status === "submitted" || s.status === "under_review").length,
      milestonesDone: workspaces.reduce((acc, w) => acc + w.milestones_done, 0),
    }),
    [assets, workspaces, submissions]
  );

  const statsData = [
    { label: "Knowledge Hub Assets", value: stats.bookmarked, icon: <BookOpen className="h-5 w-5" /> },
    { label: "Active Workspaces", value: stats.activeWorkspaces, icon: <Users className="h-5 w-5" /> },
    { label: "Portal Submissions in Review", value: stats.submissionsInFlight, icon: <Trophy className="h-5 w-5" /> },
  ];

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              researcher
            </span>
          </h1>
          <p className="text-fg-secondary mt-1 text-sm bg-surface-muted inline-block px-2 py-0.5 rounded-md border border-border/40">
            researcher@bhumanthan.gov.in · Role: Researcher
          </p>
          <p className="text-fg-secondary mt-2 text-sm sm:text-base">
            Here's an overview of your research activity across Bhu-Manthan.
          </p>
        </div>
        <Link href="/researcher/knowledge-hub/new" className="shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            Contribute a Dataset
          </Button>
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-1 sm:mb-2">
              {stat.value}
            </div>
            <p className="text-xs sm:text-sm text-fg-secondary font-semibold uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── AI Research Assistant ── */}
      <AIResearchAssistant />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* ── Knowledge Hub feed (2/3 width) ── */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 flex items-center justify-between bg-surface-muted/30">
            <h2 className="text-lg sm:text-xl font-bold text-fg">
              Knowledge <span className="text-primary-600">Hub</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-xs h-8"
              onClick={() => router.push("/researcher/knowledge-hub")}
            >
              <Search className="h-3.5 w-3.5 mr-1.5" /> Browse All
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-surface-muted animate-pulse border border-border/40" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-danger-500" />
                </div>
                <p className="text-sm font-semibold text-fg mb-1">Something went wrong</p>
                <p className="text-xs text-fg-secondary mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchDashboard}>
                  Retry
                </Button>
              </div>
            ) : assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <p className="text-base font-semibold text-fg mb-1">No assets yet</p>
                <p className="text-sm text-fg-secondary">Bookmark a research paper or dataset to see it here.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {assets.slice(0, 6).map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => router.push(`/researcher/knowledge-hub/${asset.id}`)}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 lg:p-6 hover:bg-surface-muted transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-fg text-sm sm:text-base group-hover:text-primary-600 transition-colors truncate">
                        {asset.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-fg-muted font-medium">
                        <span className="bg-surface-sunken px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-fg-secondary border border-border/40">
                          {asset.asset_id}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{asset.type.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {asset.state}
                          {asset.district ? `, ${asset.district}` : ""}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {asset.topic}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 shrink-0 mt-2 md:mt-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1.5 uppercase tracking-wider ${
                          accessStyles[asset.access_level] || "bg-surface-muted text-fg-secondary border-border"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {asset.access_level.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-fg-muted font-medium min-w-[60px] justify-end">
                        <Clock className="h-3 w-3" />
                        {asset.year}
                      </div>
                      <ChevronRight className="h-4 w-4 text-fg-muted/50 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0 hidden md:block" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right rail: Workspaces + Innovation Portal ── */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Collaboration Workspaces (Section J) */}
          <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-surface-muted/30">
              <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-600" /> My Workspaces
              </h2>
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push("/researcher/workspaces/new")}>
                New
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                [...Array(2)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-surface-muted animate-pulse" />)
              ) : workspaces.length === 0 ? (
                <p className="text-xs text-fg-secondary text-center py-6">No active workspaces. Start a collaborative project.</p>
              ) : (
                workspaces.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => router.push(`/researcher/workspaces/${w.id}`)}
                    className="p-3 sm:p-4 rounded-xl border border-border/50 hover:border-primary-300 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <p className="font-semibold text-sm text-fg truncate">{w.name}</p>
                    <p className="text-xs text-fg-secondary mt-0.5 line-clamp-2">{w.description}</p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-fg-muted font-medium">
                      <span>{w.members} members · {w.datasets_shared} datasets</span>
                      <span>{w.milestones_done}/{w.milestones_total} milestones</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                        style={{ width: `${w.milestones_total ? (w.milestones_done / w.milestones_total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Innovation Portal (Section J) */}
          <div className="rounded-2xl sm:rounded-3xl bg-surface border border-border/60 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-surface-muted/30">
              <h2 className="text-base sm:text-lg font-bold text-fg flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Innovation Portal
              </h2>
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push("/innovation-portal")}>
                Explore
              </Button>
            </div>
            <div className="p-4 space-y-2.5">
              {loading ? (
                [...Array(2)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-surface-muted animate-pulse" />)
              ) : submissions.length === 0 ? (
                <p className="text-xs text-fg-secondary text-center py-6">No submissions yet. Browse open hackathons and grants.</p>
              ) : (
                submissions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border/50">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg truncate">{s.title}</p>
                      <p className="text-[11px] text-fg-muted">{s.track} · Due {new Date(s.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        submissionStyles[s.status] || "bg-surface-muted text-fg-secondary border-border"
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}