import { Complaint, Bill, User, AdminAction, KPIData, CitizenDocument } from "@/types";

// ────────────────────────────────────────────────────────
// Mock Users
// ────────────────────────────────────────────────────────
export const mockUsers: User[] = [
    {
        id: "u1",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        role: "citizen",
        ward: "Ward 12",
        aadhaarVerified: true,
        createdAt: "2025-06-15T10:00:00Z",
        dob: "1990-05-15",
        gender: "male",
        state: "Assam",
        city: "Silchar",
        area: "Tarapur",
        pinCode: "788001",
        aadhaarNo: "XXXX-XXXX-4321",
        gasNo: "GAS-91234",
        ivrsNo: "IVRS-7821",
        electricityAccountNo: "ELEC-78234",
        waterAccountNo: "WTR-45123",
        propertyTaxId: "PT-334521",
    },
    {
        id: "u2",
        name: "Priya Sharma",
        email: "priya.admin@suvidha.gov",
        phone: "+91 98765 11111",
        role: "admin-electricity",
        ward: "All",
        aadhaarVerified: true,
        createdAt: "2025-01-10T08:00:00Z",
        dob: "1988-11-22",
        gender: "female",
        state: "Assam",
        city: "Silchar",
        area: "Central Office",
        pinCode: "788001",
    },
    {
        id: "u3",
        name: "Anil Gupta",
        email: "anil.super@suvidha.gov",
        phone: "+91 98765 00000",
        role: "super-admin",
        ward: "All",
        aadhaarVerified: true,
        createdAt: "2024-12-01T08:00:00Z",
        dob: "1975-03-10",
        gender: "male",
        state: "Assam",
        city: "Silchar",
        area: "Headquarters",
        pinCode: "788001",
    },
    {
        id: "u4",
        name: "Meena Devi",
        email: "meena.water@suvidha.gov",
        phone: "+91 98765 22222",
        role: "admin-water",
        ward: "All",
        aadhaarVerified: true,
        createdAt: "2025-02-15T08:00:00Z",
        gender: "female",
        state: "Assam",
        city: "Silchar",
        area: "Central Office",
        pinCode: "788001",
    },
    {
        id: "u5",
        name: "Vikram Singh",
        email: "vikram.roads@suvidha.gov",
        phone: "+91 98765 33333",
        role: "admin-roads",
        ward: "All",
        aadhaarVerified: true,
        createdAt: "2025-03-01T08:00:00Z",
        gender: "male",
        state: "Assam",
        city: "Silchar",
        area: "Central Office",
        pinCode: "788001",
    },
    {
        id: "u6",
        name: "Sunita Rao",
        email: "sunita.sanitation@suvidha.gov",
        phone: "+91 98765 44444",
        role: "admin-sanitation",
        ward: "All",
        aadhaarVerified: true,
        createdAt: "2025-03-15T08:00:00Z",
        gender: "female",
        state: "Assam",
        city: "Silchar",
        area: "Central Office",
        pinCode: "788001",
    },
];

// ────────────────────────────────────────────────────────
// Mock Complaints
// ────────────────────────────────────────────────────────
export const mockComplaints: Complaint[] = [
    {
        id: "CMP-2025-001",
        title: "Streetlight not working near Sector 14 Park",
        description:
            "The streetlight pole #47 near the community park entrance in Sector 14 has been non-functional for the past 2 weeks. The area becomes very dark after 7 PM, making it unsafe for evening walkers and residents.",
        department: "electricity",
        status: "in-progress",
        priority: "high",
        ward: "Ward 12",
        location: { lat: 28.4595, lng: 77.0266 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        assignedTo: "Electrician Team B",
        votes: 24,
        hasVoted: false,
        createdAt: "2025-12-01T10:30:00Z",
        updatedAt: "2025-12-03T14:00:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered", by: "Rajesh Kumar", timestamp: "2025-12-01T10:30:00Z" },
            { id: "t2", action: "Assigned", description: "Assigned to Electrician Team B", by: "Priya Sharma", timestamp: "2025-12-02T09:00:00Z" },
            { id: "t3", action: "In Progress", description: "Team dispatched for inspection", by: "System", timestamp: "2025-12-03T14:00:00Z" },
        ],
    },
    {
        id: "CMP-2025-002",
        title: "Water pipeline leak on Main Road",
        description:
            "Major water pipeline leak causing road flooding near the junction of Main Road and MG Road. Water has been flowing continuously for 3 days. Road surface is getting damaged.",
        department: "water",
        status: "pending",
        priority: "critical",
        ward: "Ward 8",
        location: { lat: 28.4700, lng: 77.0350 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        votes: 56,
        hasVoted: true,
        createdAt: "2025-12-05T08:15:00Z",
        updatedAt: "2025-12-05T08:15:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered with critical priority", by: "Rajesh Kumar", timestamp: "2025-12-05T08:15:00Z" },
        ],
    },
    {
        id: "CMP-2025-003",
        title: "Pothole causing accidents near School Zone",
        description:
            "Large pothole approximately 2 feet wide has formed on the road near Government School, Sector 7. Multiple two-wheeler accidents reported. Needs immediate attention.",
        department: "roads",
        status: "resolved",
        priority: "high",
        ward: "Ward 5",
        location: { lat: 28.4550, lng: 77.0200 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        votes: 89,
        hasVoted: true,
        createdAt: "2025-11-20T15:45:00Z",
        updatedAt: "2025-11-28T11:00:00Z",
        resolvedAt: "2025-11-28T11:00:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered", by: "Rajesh Kumar", timestamp: "2025-11-20T15:45:00Z" },
            { id: "t2", action: "Assigned", description: "Assigned to Roads Dept Team A", by: "Admin", timestamp: "2025-11-21T09:00:00Z" },
            { id: "t3", action: "In Progress", description: "Repair work started", by: "System", timestamp: "2025-11-25T08:00:00Z" },
            { id: "t4", action: "Resolved", description: "Pothole filled and road resurfaced", by: "Roads Dept Team A", timestamp: "2025-11-28T11:00:00Z" },
        ],
    },
    {
        id: "CMP-2025-004",
        title: "Garbage not collected for 5 days",
        description:
            "Municipal garbage collection has not happened in Block C, Sector 22 for the past 5 days. Waste is piling up and causing health hazards. Stray dogs are scattering the waste.",
        department: "sanitation",
        status: "escalated",
        priority: "medium",
        ward: "Ward 12",
        location: { lat: 28.4620, lng: 77.0280 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        votes: 42,
        hasVoted: false,
        createdAt: "2025-12-04T07:00:00Z",
        updatedAt: "2025-12-06T16:30:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered", by: "Rajesh Kumar", timestamp: "2025-12-04T07:00:00Z" },
            { id: "t2", action: "Escalated", description: "No response from department for 48 hours, auto-escalated", by: "System", timestamp: "2025-12-06T16:30:00Z" },
        ],
    },
    {
        id: "CMP-2025-005",
        title: "Transformer buzzing loudly in residential area",
        description:
            "The electricity transformer near House No. 45, Lane 3, Sector 11 is making very loud buzzing sounds, especially at night. Residents are concerned about potential hazard.",
        department: "electricity",
        status: "pending",
        priority: "medium",
        ward: "Ward 3",
        location: { lat: 28.4580, lng: 77.0310 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        votes: 15,
        hasVoted: false,
        createdAt: "2025-12-06T20:00:00Z",
        updatedAt: "2025-12-06T20:00:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered", by: "Rajesh Kumar", timestamp: "2025-12-06T20:00:00Z" },
        ],
    },
    {
        id: "CMP-2025-006",
        title: "Broken water meter showing wrong readings",
        description:
            "Water meter at connection #WM-7834 has been giving inaccurate readings for the past 2 billing cycles. Bills have been abnormally high despite normal usage.",
        department: "water",
        status: "in-progress",
        priority: "low",
        ward: "Ward 12",
        location: { lat: 28.4610, lng: 77.0290 },
        images: [],
        citizenId: "u1",
        citizenName: "Rajesh Kumar",
        assignedTo: "Meter Inspection Team",
        votes: 8,
        hasVoted: false,
        createdAt: "2025-12-02T11:20:00Z",
        updatedAt: "2025-12-04T15:00:00Z",
        timeline: [
            { id: "t1", action: "Filed", description: "Complaint registered", by: "Rajesh Kumar", timestamp: "2025-12-02T11:20:00Z" },
            { id: "t2", action: "Assigned", description: "Assigned to Meter Inspection Team", by: "Water Admin", timestamp: "2025-12-03T10:00:00Z" },
            { id: "t3", action: "In Progress", description: "Meter inspection scheduled", by: "System", timestamp: "2025-12-04T15:00:00Z" },
        ],
    },
];

// ────────────────────────────────────────────────────────
// Mock Bills
// ────────────────────────────────────────────────────────
export const mockBills: Bill[] = [
    { id: "b1", type: "electricity", amount: 2450, dueDate: "2026-03-15", status: "unpaid", period: "Feb 2026", accountNumber: "ELEC-78234" },
    { id: "b2", type: "water", amount: 680, dueDate: "2026-03-10", status: "unpaid", period: "Feb 2026", accountNumber: "WTR-45123" },
    { id: "b3", type: "gas", amount: 1120, dueDate: "2026-02-28", status: "overdue", period: "Jan 2026", accountNumber: "GAS-91234" },
    { id: "b4", type: "property-tax", amount: 12500, dueDate: "2026-06-30", status: "unpaid", period: "FY 2026-27", accountNumber: "PT-334521" },
    { id: "b5", type: "electricity", amount: 2180, dueDate: "2026-02-15", status: "paid", period: "Jan 2026", accountNumber: "ELEC-78234" },
    { id: "b6", type: "water", amount: 550, dueDate: "2026-02-10", status: "paid", period: "Jan 2026", accountNumber: "WTR-45123" },
];

// ────────────────────────────────────────────────────────
// Mock KPI Data
// ────────────────────────────────────────────────────────
export const mockKPIs: KPIData[] = [
    { label: "Total Complaints", value: "1,247", change: 12, trend: "up", icon: "FileText" },
    { label: "Resolved Today", value: "38", change: 8, trend: "up", icon: "CheckCircle" },
    { label: "Avg Resolution Time", value: "3.2 days", change: -15, trend: "down", icon: "Clock" },
    { label: "Citizen Satisfaction", value: "94%", change: 3, trend: "up", icon: "ThumbsUp" },
];

// ────────────────────────────────────────────────────────
// Mock Admin Actions Queue
// ────────────────────────────────────────────────────────
export const mockAdminActions: AdminAction[] = mockComplaints
    .filter((c) => c.status === "pending" || c.status === "escalated")
    .map((c) => ({
        id: `action-${c.id}`,
        complaintId: c.id,
        title: c.title,
        department: c.department,
        priority: c.priority,
        citizenName: c.citizenName,
        ward: c.ward,
        createdAt: c.createdAt,
        status: c.status,
    }));

// ────────────────────────────────────────────────────────
// Mock Chart Data
// ────────────────────────────────────────────────────────
export const mockChartData = {
    complaintsOverTime: [
        { month: "Jul", filed: 180, resolved: 150 },
        { month: "Aug", filed: 210, resolved: 190 },
        { month: "Sep", filed: 195, resolved: 185 },
        { month: "Oct", filed: 230, resolved: 210 },
        { month: "Nov", filed: 250, resolved: 235 },
        { month: "Dec", filed: 220, resolved: 200 },
    ],
    byDepartment: [
        { name: "Electricity", value: 340, color: "#F59E0B" },
        { name: "Water", value: 280, color: "#3B82F6" },
        { name: "Roads", value: 215, color: "#8B5CF6" },
        { name: "Sanitation", value: 190, color: "#10B981" },
    ],
    resolutionByWard: [
        { ward: "W-1", rate: 92 },
        { ward: "W-3", rate: 87 },
        { ward: "W-5", rate: 95 },
        { ward: "W-8", rate: 78 },
        { ward: "W-12", rate: 91 },
        { ward: "W-15", rate: 84 },
    ],
};

// ────────────────────────────────────────────────────────
// Mock Citizen Documents (for admin verification)
// ────────────────────────────────────────────────────────
export const mockCitizenDocuments: CitizenDocument[] = [
    { id: "doc-1", citizenId: "u1", citizenName: "Rajesh Kumar", type: "aadhaar", fileName: "aadhaar_rajesh.pdf", uploadedAt: "2025-12-01T10:00:00Z", status: "verified", verifiedBy: "Priya Sharma", verifiedAt: "2025-12-02T09:00:00Z" },
    { id: "doc-2", citizenId: "u1", citizenName: "Rajesh Kumar", type: "address-proof", fileName: "address_proof_rajesh.pdf", uploadedAt: "2025-12-01T10:05:00Z", status: "verified", verifiedBy: "Priya Sharma", verifiedAt: "2025-12-02T09:05:00Z" },
    { id: "doc-3", citizenId: "u1", citizenName: "Rajesh Kumar", type: "property", fileName: "property_doc_rajesh.pdf", uploadedAt: "2025-12-03T14:00:00Z", status: "pending" },
    { id: "doc-4", citizenId: "u1", citizenName: "Rajesh Kumar", type: "photo", fileName: "passport_photo.jpg", uploadedAt: "2025-12-04T08:30:00Z", status: "rejected", rejectionReason: "Photo is blurred, please upload a clear passport-size photo" },
    { id: "doc-5", citizenId: "u1", citizenName: "Sita Devi", type: "aadhaar", fileName: "aadhaar_sita.pdf", uploadedAt: "2025-12-05T11:00:00Z", status: "pending" },
    { id: "doc-6", citizenId: "u1", citizenName: "Sita Devi", type: "pan", fileName: "pan_sita.pdf", uploadedAt: "2025-12-05T11:02:00Z", status: "pending" },
    { id: "doc-7", citizenId: "u1", citizenName: "Amit Patel", type: "id-proof", fileName: "voter_id_amit.pdf", uploadedAt: "2025-12-06T09:15:00Z", status: "pending" },
    { id: "doc-8", citizenId: "u1", citizenName: "Amit Patel", type: "address-proof", fileName: "utility_bill_amit.pdf", uploadedAt: "2025-12-06T09:20:00Z", status: "verified", verifiedBy: "Meena Devi", verifiedAt: "2025-12-06T14:00:00Z" },
];
