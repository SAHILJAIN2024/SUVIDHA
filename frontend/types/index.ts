export type Role =
    | "citizen"
    | "admin-electricity"
    | "admin-water"
    | "admin-roads"
    | "admin-sanitation"
    | "super-admin";

export type ComplaintStatus =
    | "pending"
    | "in-progress"
    | "resolved"
    | "rejected"
    | "escalated";

export type Department = "electricity" | "water" | "roads" | "sanitation";

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    ward: string;
    aadhaarVerified: boolean;
    avatarUrl?: string;
    createdAt: string;
}

export interface Complaint {
    id: string;
    title: string;
    description: string;
    department: Department;
    status: ComplaintStatus;
    priority: "low" | "medium" | "high" | "critical";
    ward: string;
    location: { lat: number; lng: number };
    images: string[];
    citizenId: string;
    citizenName: string;
    assignedTo?: string;
    votes: number;
    hasVoted: boolean;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    timeline: TimelineEntry[];
}

export interface TimelineEntry {
    id: string;
    action: string;
    description: string;
    by: string;
    timestamp: string;
}

export interface Bill {
    id: string;
    type: "electricity" | "water" | "gas" | "property-tax";
    amount: number;
    dueDate: string;
    status: "unpaid" | "paid" | "overdue";
    period: string;
    accountNumber: string;
}

export interface KPIData {
    label: string;
    value: number | string;
    change: number;
    trend: "up" | "down" | "stable";
    icon: string;
}

export interface AdminAction {
    id: string;
    complaintId: string;
    title: string;
    department: Department;
    priority: "low" | "medium" | "high" | "critical";
    citizenName: string;
    ward: string;
    createdAt: string;
    status: ComplaintStatus;
}
