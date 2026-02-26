import { mockBills } from "./mock-data";
import { Bill } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getBills(): Promise<Bill[]> {
    await delay(300);
    return mockBills;
}

export async function payBill(id: string): Promise<Bill | undefined> {
    await delay(800);
    const bill = mockBills.find((b) => b.id === id);
    if (bill) {
        bill.status = "paid";
    }
    return bill;
}
