import { Bill } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getBills = async (): Promise<Bill[]> => {
    try {
        const data = await fetch(`${API_BASE}/bills/my`);
        return data.json();
    } catch (error) {
        console.error("Failed to fetch bills:", error);
        return [];
    }
};

export const getMyBills = getBills;

export const payBill = async (billId: string): Promise<{ success: boolean; message: string }> => {
    return fetch(`${API_BASE}/bills/${billId}/pay`, {
        method: "POST"
    }).then(response => response.json());
};
