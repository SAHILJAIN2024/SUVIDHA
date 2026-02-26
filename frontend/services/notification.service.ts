const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface NotificationItem {
    id: string;
    type: "success" | "warning" | "info" | "alert";
    title: string;
    message: string;
    department?: string;
    complaintId?: string;
    timestamp: string;
    read: boolean;
}

const notificationsStore: NotificationItem[] = [
    { id: "n1", type: "success", title: "Complaint Resolved", message: "Your complaint CMP-2025-003 (Pothole near School Zone) has been resolved. Please rate the service.", complaintId: "CMP-2025-003", department: "roads", timestamp: "2025-12-08T10:30:00Z", read: false },
    { id: "n2", type: "warning", title: "Complaint Escalated", message: "Your complaint CMP-2025-004 (Garbage not collected) has been auto-escalated to Senior Officer due to no response in 48 hours.", complaintId: "CMP-2025-004", department: "sanitation", timestamp: "2025-12-07T16:30:00Z", read: false },
    { id: "n3", type: "info", title: "Status Update", message: "Complaint CMP-2025-001 (Streetlight not working) — Electrician Team B has been dispatched for inspection.", complaintId: "CMP-2025-001", department: "electricity", timestamp: "2025-12-06T14:00:00Z", read: false },
    { id: "n4", type: "alert", title: "Bill Payment Due", message: "Your Gas bill of ₹1,120 for Jan 2026 is overdue. Please pay immediately to avoid disconnection.", timestamp: "2025-12-06T08:00:00Z", read: true },
    { id: "n5", type: "info", title: "Welcome to SUVIDHA", message: "Your account has been created and Aadhaar verified. You can now file complaints, pay bills, and access civic services.", timestamp: "2025-06-15T10:00:00Z", read: true },
    { id: "n6", type: "success", title: "Bill Payment Received", message: "₹2,180 payment for Electricity bill (Jan 2026) has been received. Receipt ID: RCP-789456.", timestamp: "2025-12-05T09:00:00Z", read: true },
    { id: "n7", type: "warning", title: "Scheduled Maintenance", message: "Water supply in Ward 12 will be interrupted on Dec 10 from 10 AM to 4 PM for pipeline maintenance.", department: "water", timestamp: "2025-12-04T12:00:00Z", read: true },
];

export async function getNotifications(): Promise<NotificationItem[]> {
    await delay(300);
    return [...notificationsStore];
}

export async function markNotificationRead(id: string): Promise<void> {
    await delay(100);
    const n = notificationsStore.find((n) => n.id === id);
    if (n) n.read = true;
}

export async function markAllNotificationsRead(): Promise<void> {
    await delay(200);
    notificationsStore.forEach((n) => (n.read = true));
}

export async function deleteNotification(id: string): Promise<void> {
    await delay(200);
    const idx = notificationsStore.findIndex((n) => n.id === id);
    if (idx !== -1) notificationsStore.splice(idx, 1);
}
