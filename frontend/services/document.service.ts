import { mockCitizenDocuments } from "./mock-data";
import { CitizenDocument } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface CDocumentItem {
    id: string;
    name: string;
    type: string;
    status: "pending" | "verified" | "rejected";
    uploadedAt: string;
    rejectionReason?: string;
}

// Citizen-side documents
const citizenDocs: CDocumentItem[] = [
    { id: "d1", name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2025-06-15" },
    { id: "d2", name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2025-06-15" },
    { id: "d3", name: "Electricity Bill (Address Proof)", type: "address", status: "pending", uploadedAt: "2025-12-01" },
    { id: "d4", name: "Property Tax Receipt", type: "property", status: "rejected", uploadedAt: "2025-11-20", rejectionReason: "Document expired, upload recent copy" },
];

export async function getCitizenDocuments(): Promise<CDocumentItem[]> {
    await delay(400);
    return [...citizenDocs];
}

export async function uploadDocument(name: string): Promise<CDocumentItem> {
    await delay(1000);
    const newDoc: CDocumentItem = {
        id: `d${Date.now()}`,
        name,
        type: "other",
        status: "pending",
        uploadedAt: new Date().toISOString().split("T")[0],
    };
    citizenDocs.push(newDoc);
    return newDoc;
}

export async function deleteDocument(id: string): Promise<void> {
    await delay(300);
    const idx = citizenDocs.findIndex((d) => d.id === id);
    if (idx !== -1) citizenDocs.splice(idx, 1);
}

// Admin-side document verification
export async function getAdminDocuments(): Promise<CitizenDocument[]> {
    await delay(400);
    return [...mockCitizenDocuments];
}

export async function verifyDocument(id: string): Promise<void> {
    await delay(500);
    const doc = mockCitizenDocuments.find((d) => d.id === id);
    if (doc) {
        doc.status = "verified";
        doc.verifiedBy = "Current Admin";
        doc.verifiedAt = new Date().toISOString();
    }
}

export async function rejectDocument(id: string, reason: string): Promise<void> {
    await delay(500);
    const doc = mockCitizenDocuments.find((d) => d.id === id);
    if (doc) {
        doc.status = "rejected";
        doc.rejectionReason = reason;
    }
}
