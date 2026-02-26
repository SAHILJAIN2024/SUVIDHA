
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface WardData {
    ward: string;
    total: number;
    resolved: number;
    rate: string;
    lat?: string;
    lng?: string;
}

export interface WardContact {
    ward: string;
    officer: string;
    designation: string;
    phone: string;
    email: string;
}

export interface WardMapMarker {
    left: string;
    top: string;
    lat: number;
    lng: number;
    label: string;
    complaints: number;
    color: string;
    status: 'low' | 'medium' | 'high';
}

const wardDataStore: WardData[] = [
    { ward: "W-1", total: 12, resolved: 11, rate: "92%" },
    { ward: "W-3", total: 8, resolved: 7, rate: "87%" },
    { ward: "W-5", total: 23, resolved: 22, rate: "95%" },
    { ward: "W-8", total: 31, resolved: 24, rate: "78%" },
    { ward: "W-12", total: 15, resolved: 14, rate: "91%" },
    { ward: "W-15", total: 19, resolved: 16, rate: "84%" },
];

const wardContactsStore: WardContact[] = [
    { ward: "W-1", officer: "Suresh Yadav", designation: "Ward Officer", phone: "+91 98100 12001", email: "w1.officer@suvidha.gov" },
    { ward: "W-3", officer: "Meena Gupta", designation: "Ward Officer", phone: "+91 98100 12003", email: "w3.officer@suvidha.gov" },
    { ward: "W-5", officer: "Rakesh Singh", designation: "Senior Inspector", phone: "+91 98100 12005", email: "w5.officer@suvidha.gov" },
    { ward: "W-8", officer: "Anita Sharma", designation: "Ward Officer", phone: "+91 98100 12008", email: "w8.officer@suvidha.gov" },
    { ward: "W-12", officer: "Deepak Verma", designation: "Ward Officer", phone: "+91 98100 12012", email: "w12.officer@suvidha.gov" },
    { ward: "W-15", officer: "Kavita Joshi", designation: "Senior Inspector", phone: "+91 98100 12015", email: "w15.officer@suvidha.gov" },
];

const wardMarkersStore: WardMapMarker[] = [
    { left: "20%", top: "25%", lat: 28.6328, lng: 77.2197, label: "W-1", complaints: 12, color: "bg-success-500/20", status: 'low' },
    { left: "45%", top: "15%", lat: 28.6139, lng: 77.2090, label: "W-3", complaints: 8, color: "bg-success-500/20", status: 'low' },
    { left: "65%", top: "30%", lat: 28.5932, lng: 77.2215, label: "W-5", complaints: 23, color: "bg-warning-500/20", status: 'medium' },
    { left: "30%", top: "55%", lat: 28.5623, lng: 77.1852, label: "W-8", complaints: 31, color: "bg-danger-500/20", status: 'high' },
    { left: "55%", top: "60%", lat: 28.4595, lng: 77.0266, label: "W-12", complaints: 15, color: "bg-primary-500/20", status: 'medium' },
    { left: "75%", top: "50%", lat: 28.7041, lng: 77.1025, label: "W-15", complaints: 19, color: "bg-warning-500/20", status: 'medium' },
];

export async function getWardData(): Promise<WardData[]> {
    await delay(300);
    return [...wardDataStore];
}

export async function getWardContacts(): Promise<WardContact[]> {
    await delay(300);
    return [...wardContactsStore];
}

export async function getWardMapMarkers(): Promise<WardMapMarker[]> {
    await delay(200);
    return [...wardMarkersStore];
}

export interface DepartmentInfo {
    id: string;
    label: string;
    icon: string;
    color: string;
    desc: string;
    services: string[];
}

const departmentsStore: DepartmentInfo[] = [
    { id: "electricity", label: "Electricity", icon: "Zap", color: "#F59E0B", desc: "Report outages, faulty meters, streetlights", services: ["Report Outage", "Meter Issue", "New Connection"] },
    { id: "water", label: "Water Supply", icon: "Droplets", color: "#3B82F6", desc: "Leaks, supply disruptions, water quality", services: ["Report Leak", "Low Pressure", "Quality Complaint"] },
    { id: "roads", label: "Roads & Infra", icon: "Route", color: "#8B5CF6", desc: "Potholes, damaged signage, construction", services: ["Report Pothole", "Damaged Sign", "Illegal Dumping"] },
    { id: "sanitation", label: "Sanitation", icon: "Recycle", color: "#10B981", desc: "Garbage, drainage, public cleanliness", services: ["Missed Pickup", "Clogged Drain", "Bin Request"] },
];

export async function getDepartments(): Promise<DepartmentInfo[]> {
    await delay(200);
    return [...departmentsStore];
}

export interface QuickAction {
    label: string;
    icon: string;
    href: string;
    color: string;
}

const quickActionsStore: QuickAction[] = [
    { label: "File Complaint", icon: "FileText", href: "/citizen/complaints/new", color: "bg-primary-600" },
    { label: "Request Connection", icon: "Plug", href: "/citizen/services/request-connection", color: "bg-amber-600" },
    { label: "Pay Bills", icon: "CreditCard", href: "/citizen/bills", color: "bg-accent-600" },
    { label: "Verify Documents", icon: "ShieldCheck", href: "/citizen/documents", color: "bg-emerald-600" },
    { label: "Helpline", icon: "Phone", href: "#", color: "bg-success-600" },
    { label: "FAQs", icon: "HelpCircle", href: "#", color: "bg-blue-600" },
];

export async function getQuickActions(): Promise<QuickAction[]> {
    await delay(100);
    return [...quickActionsStore];
}

// Admin reports summary stats
export interface ReportSummary {
    label: string;
    value: string;
    sub: string;
}

const reportSummaryStore: ReportSummary[] = [
    { label: "Total Filed", value: "1,285", sub: "Last 6 months" },
    { label: "Total Resolved", value: "1,170", sub: "91% resolution" },
    { label: "Avg Resolution", value: "3.2 days", sub: "↓ 15% from last quarter" },
    { label: "Satisfaction", value: "94%", sub: "↑ 3% improvement" },
];

export async function getReportSummary(): Promise<ReportSummary[]> {
    await delay(300);
    return [...reportSummaryStore];
}
