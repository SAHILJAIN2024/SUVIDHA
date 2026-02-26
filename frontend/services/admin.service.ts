import { mockAdminActions, mockKPIs, mockChartData } from "./mock-data";
import { AdminAction, KPIData } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getKPIs(): Promise<KPIData[]> {
    await delay(300);
    return mockKPIs;
}

export async function getActionQueue(): Promise<AdminAction[]> {
    await delay(300);
    return mockAdminActions;
}

export async function getChartData() {
    await delay(400);
    return mockChartData;
}

export async function updateComplaintStatus(
    complaintId: string,
    status: string
): Promise<AdminAction | undefined> {
    await delay(400);
    const action = mockAdminActions.find((a) => a.complaintId === complaintId);
    if (action) {
        action.status = status as AdminAction["status"];
    }
    return action;
}
