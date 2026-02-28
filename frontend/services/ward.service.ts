import { authFetch } from "./authFetch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WardData {
    ward: string;
    rate: string;
    resolved: number;
    total: number;
}

export interface WardContact {
    ward: string;
    designation: string;
    officer: string;
    phone: string;
    email: string;
}

export interface WardMapMarker {
    lat: number;
    lng: number;
    label: string;
    complaints: number;
    status: string;
}

export interface DepartmentInfo {
    id: string;
    label: string;
    icon: string;
    color: string;
    desc: string;
    services: string[];
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    href: string;
    color: string;
}

export const getWardData = async (): Promise<WardData[]> => {
    try {
        const data = await authFetch(`${API_BASE}/wards/stats`);
        return data.data;
    } catch (error) {
        return [
            { ward: "Ward 1", rate: "92%", resolved: 450, total: 489 },
            { ward: "Ward 2", rate: "88%", resolved: 380, total: 432 },
            { ward: "Ward 3", rate: "95%", resolved: 512, total: 538 },
        ];
    }
};

export const getWardContacts = async (): Promise<WardContact[]> => {
    try {
        const data = await authFetch(`${API_BASE}/wards/contacts`);
        return data.data;
    } catch (error) {
        return [
            { ward: "Ward 1", designation: "Ward Officer", officer: "Rajesh Kumar", phone: "9876543210", email: "rajesh.k@city.gov" },
            { ward: "Ward 2", designation: "Asst. Engineer", officer: "Sanjay Singh", phone: "9876543211", email: "sanjay.s@city.gov" },
        ];
    }
};

export const getWardMapMarkers = async (): Promise<WardMapMarker[]> => {
    try {
        const data = await authFetch(`${API_BASE}/wards/markers`);
        return data.data;
    } catch (error) {
        return [
            { lat: 28.6139, lng: 77.2090, label: "Ward 1", complaints: 12, status: "Critical" },
            { lat: 28.6239, lng: 77.2190, label: "Ward 2", complaints: 5, status: "Normal" },
        ];
    }
};

export const getDepartments = async (): Promise<DepartmentInfo[]> => {
    try {
        const data = await authFetch(`${API_BASE}/departments`);
        return data.data;
    } catch (error) {
        return [
            { 
                id: "1", label: "Electricity", icon: "Zap", color: "#F59E0B", 
                desc: "Street lighting, domestic connections and power maintenance.",
                services: ["New Connection", "Fault Report", "Bill Issue"]
            },
            { 
                id: "2", label: "Water Supply", icon: "Droplets", color: "#3B82F6", 
                desc: "Drinking water supply and pipeline maintenance.",
                services: ["Water Tanker", "Pipe Leakage", "Meter Issue"]
            },
        ];
    }
};

export const getQuickActions = async (): Promise<QuickAction[]> => {
    try {
        const data = await authFetch(`${API_BASE}/quick-actions`);
        return data.data;
    } catch (error) {
        return [
            { id: "1", label: "New Complaint", icon: "FileText", href: "/citizen/complaints/new", color: "bg-primary-500" },
            { id: "2", label: "Pay Bill", icon: "CreditCard", href: "/citizen/bills", color: "bg-warning-500" },
        ];
    }
};
