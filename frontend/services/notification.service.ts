import { authFetch } from "./authFetch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "danger" | "alert";
    read: boolean;
    createdAt: string;
    timestamp: string; // Used in UI
    department?: string;
    complaintId?: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
    try {
        const data = await authFetch(`${API_BASE}/notifications`);
        return data.data.map((item: any) => ({
            ...item,
            timestamp: item.timestamp || item.createdAt
        }));
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // Fallback mock data if fetch fails
        return [
            {
                id: "1",
                title: "Complaint Resolved",
                message: "Your complaint about street light has been resolved.",
                type: "success",
                read: false,
                createdAt: new Date().toISOString(),
                timestamp: new Date().toISOString(),
                department: "electricity",
                complaintId: "ELEC-1234"
            }
        ];
    }
};

export const markNotificationRead = async (id: string): Promise<boolean> => {
    try {
        await authFetch(`${API_BASE}/notifications/${id}/read`, { method: "PUT" });
        return true;
    } catch (error) {
        return false;
    }
};

export const markAllNotificationsRead = async (): Promise<boolean> => {
    try {
        await authFetch(`${API_BASE}/notifications/read-all`, { method: "PUT" });
        return true;
    } catch (error) {
        return false;
    }
};

export const deleteNotification = async (id: string): Promise<boolean> => {
    try {
        await authFetch(`${API_BASE}/notifications/${id}`, { method: "DELETE" });
        return true;
    } catch (error) {
        return false;
    }
};
