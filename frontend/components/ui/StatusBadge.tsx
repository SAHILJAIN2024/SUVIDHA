import { Badge } from "./Badge";
import { ComplaintStatus } from "@/types";

const statusConfig: Record<ComplaintStatus, { label: string; variant: "warning" | "primary" | "success" | "danger" | "accent" }> = {
    pending: { label: "Pending", variant: "warning" },
    "in-progress": { label: "In Progress", variant: "primary" },
    resolved: { label: "Resolved", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    escalated: { label: "Escalated", variant: "accent" },
};

export function StatusBadge({ status, size = "md" }: { status: ComplaintStatus; size?: "sm" | "md" | "lg" }) {
    const config = statusConfig[status];
    return (
        <Badge variant={config.variant} size={size} dot>
            {config.label}
        </Badge>
    );
}
