/* ═══════════════════════════════════════════════════════════
   Bhu-Manthan — Shared Types
   Replaces the old civic-complaint entity model.
   ═══════════════════════════════════════════════════════════ */

export type UserRole =
  | "public"
  | "researcher"
  | "government_official"
  | "governance_participant"
  | "administrator";

/** Section A — Knowledge Hub item */
export interface ResearchAsset {
  id: number;
  asset_id: string; // e.g. "BM-DOC-2026-0417"
  title: string;
  type: "research_paper" | "policy_document" | "dataset" | "gis_layer" | "case_study" | "project_report";
  author: string;
  organisation: string;
  year: number;
  state: string;
  district?: string;
  topic: string;
  keywords: string[];
  access_level: "public" | "researcher" | "government_official";
  created_at: string;
}

/** Section B — AI Research Assistant citation */
export interface Citation {
  asset_id: string;
  title: string;
  snippet: string;
}

export interface AIQueryResult {
  id: number;
  query: string;
  answer: string;
  citations: Citation[];
  asked_at: string;
}

/** Section E — Policy Simulation Engine */
export interface SimulationParameters {
  urban_expansion_pct: number;
  population_growth_pct: number;
  protected_land_constraint_pct: number;
  infrastructure_growth_target_pct: number;
}

export interface SimulationResult {
  label: string; // "Policy A", "Baseline", etc.
  parameters: SimulationParameters;
  projected_agri_land_change_pct: number;
  projected_infra_demand_index: number;
  population_affected: number;
  climate_risk_rating: "Low" | "Moderate" | "High" | "Severe";
}

/** Section G — Parcel Rights & Status Ledger (ERC-721 parcel + ERC-1155 rights classes) */
export type RightsClass = string;

export type ProposalStatus = "pending_review" | "approved" | "rejected";

export interface GovernanceProposal {
  id: number;
  proposal_id: string; // e.g. "PROP-2026-0093"
  ulpin: string; // parcel reference
  rights_class: RightsClass;
  summary: string;
  submitted_by: string; // source institution / system
  reviewer_role: string;
  status: ProposalStatus;
  submitted_at: string;
  decided_at?: string;
  decided_by?: string;
}

export interface ParcelLedgerEntry {
  id: number;
  ulpin: string;
  token_standard: "ERC-721" | "ERC-1155";
  rights_class?: RightsClass;
  event: string; // e.g. "Land-Use status updated: Agricultural -> Urban"
  tx_hash: string;
  timestamp: string;
}

/** Section J — Collaboration & Innovation Hub */
export interface Workspace {
  id: number;
  name: string;
  description: string;
  members: number;
  datasets_shared: number;
  milestones_total: number;
  milestones_done: number;
  updated_at: string;
}

export interface InnovationSubmission {
  id: number;
  title: string;
  track: string;
  status: "draft" | "submitted" | "under_review" | "shortlisted" | "rejected";
  deadline: string;
}

/** Section D/K — KPIs for dashboards */
export interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
}

/** Section F — Government Data Integration Layer status */
export interface IntegrationStatus {
  name: string;
  status: "connected" | "degraded" | "disconnected";
  last_sync: string;
  formatted_date: string;
}