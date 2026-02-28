export type Role =
    | "citizen"
    | "admin-electricity"
    | "admin-water"
    | "admin-roads"
    | "admin-sanitation"
    | "super-admin";


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
    // Extended ER diagram fields
    dob?: string;
    gender?: "male" | "female" | "other";
    state?: string;
    city?: string;
    area?: string;
    pinCode?: string;
    aadhaarNo?: string;
    gasNo?: string;
    ivrsNo?: string;
    // Linked account numbers
    electricityAccountNo?: string;
    waterAccountNo?: string;
    propertyTaxId?: string;
}

export type ComplaintStatus =
  | "pending"
  | "in-progress"
  | "resolved"
  | "rejected"
  | "escalated";

export type ComplaintPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type Department =
  | "electricity"
  | "water"
  | "roads"
  | "sanitation";

export interface Complaint {
  id: string; // IMPORTANT: always string on frontend
  title: string;
  description: string;

  department: Department;
  ward: string;

  status: ComplaintStatus;
  priority: ComplaintPriority;

  votes: number;
  hasVoted?: boolean;

  createdAt: string;
  updatedAt: string;
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

export interface CitizenDocument {
    id: string;
    citizenId: string;
    citizenName: string;
    type: "aadhaar" | "pan" | "address-proof" | "property" | "id-proof" | "photo";
    fileName: string;
    uploadedAt: string;
    status: "pending" | "verified" | "rejected";
    rejectionReason?: string;
    verifiedBy?: string;
    verifiedAt?: string;
}
