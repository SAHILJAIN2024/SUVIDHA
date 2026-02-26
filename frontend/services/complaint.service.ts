import { mockComplaints } from "./mock-data";
import { Complaint } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getComplaints(): Promise<Complaint[]> {
    await delay(300);
    return mockComplaints;
}

export async function getComplaintById(id: string): Promise<Complaint | undefined> {
    await delay(200);
    return mockComplaints.find((c) => c.id === id);
}

export async function createComplaint(
    data: Partial<Complaint>
): Promise<Complaint> {
    await delay(500);
    const newComplaint: Complaint = {
        id: `CMP-2025-${String(mockComplaints.length + 1).padStart(3, "0")}`,
        title: data.title || "",
        description: data.description || "",
        department: data.department || "electricity",
        status: "pending",
        priority: data.priority || "medium",
        ward: data.ward || "Ward 12",
        location: data.location || { lat: 28.46, lng: 77.03 },
        images: data.images || [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        votes: 0,
        hasVoted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
            {
                id: "t1",
                action: "Filed",
                description: "Complaint registered",
                by: "Rajesh Kumar",
                timestamp: new Date().toISOString(),
            },
        ],
    };
    mockComplaints.push(newComplaint);
    return newComplaint;
}

export async function voteComplaint(id: string): Promise<Complaint | undefined> {
    await delay(200);
    const complaint = mockComplaints.find((c) => c.id === id);
    if (complaint) {
        complaint.votes += 1;
        complaint.hasVoted = true;
    }
    return complaint;
}
