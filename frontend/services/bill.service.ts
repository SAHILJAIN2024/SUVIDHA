import { authFetch } from "./authFetch";
import { Bill } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getBills = async (): Promise<Bill[]> => {
    try {
        const data = await authFetch(`${API_BASE}/bills/my`);
        return data.data;
    } catch (error) {
        console.error("Failed to fetch bills:", error);
        return [];
    }
};

export const getMyBills = getBills;

export const payBill = async (billId: string): Promise<{ success: boolean; message: string }> => {
    return authFetch(`${API_BASE}/bills/${billId}/pay`, {
        method: "POST"
    });
};
