export const APP_NAME = "SUVIDHA";
export const APP_TAGLINE = "Your City. Your Voice. Your SUVIDHA.";
export const APP_DESCRIPTION =
    "A unified government civic services platform for filing complaints, paying utility bills, requesting services, and tracking resolutions.";

export const DEPARTMENTS = [
    { id: "electricity", label: "Electricity", icon: "Zap", color: "#F59E0B" },
    { id: "water", label: "Water Supply", icon: "Droplets", color: "#3B82F6" },
    { id: "roads", label: "Roads & Infrastructure", icon: "Route", color: "#8B5CF6" },
    { id: "sanitation", label: "Sanitation", icon: "Recycle", color: "#10B981" },
] as const;

export const COMPLAINT_STATUSES = [
    { id: "pending", label: "Pending", color: "#F59E0B" },
    { id: "in-progress", label: "In Progress", color: "#3B82F6" },
    { id: "resolved", label: "Resolved", color: "#10B981" },
    { id: "rejected", label: "Rejected", color: "#EF4444" },
    { id: "escalated", label: "Escalated", color: "#8B5CF6" },
] as const;

export const ROLES = {
    CITIZEN: "citizen",
    ADMIN_ELECTRICITY: "admin-electricity",
    ADMIN_WATER: "admin-water",
    ADMIN_ROADS: "admin-roads",
    ADMIN_SANITATION: "admin-sanitation",
    SUPER_ADMIN: "super-admin",
} as const;

export const KIOSK_TIMEOUT_MS = 120_000; // 2 minutes
