"use client";
import CreateComplaintForm from "@/components/newComplain";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

const ITEMS_PER_PAGE = 5;

interface Complaint {
  id: number;
  ticket_id: string;
  category: string;
  complaint_type: string;
  subject: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  created_at: string;
  authority_name?: string;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  const fetchComplaints = useCallback(async () => {
    try {
      if (!token) return;

      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("Backend returned failure");
      }

      setComplaints(data.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.ticket_id.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "all" || c.category === categoryFilter;

      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-surface border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
        <p>{error}</p>
        <Button onClick={fetchComplaints} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Complaints</h1>
          <p className="text-fg-secondary">
            {complaints.length} complaints total
          </p>
        </div>

        {/* Pass refresh function to auto update after new complaint */}
        <CreateComplaintForm />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Search by subject or ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "in_progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "rejected", label: "Rejected" },
                { value: "escalated", label: "Escalated" },
              ]}
            />

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "street_light", label: "Street Light" },
                { value: "pothole", label: "Pothole" },
                { value: "broken_road", label: "Broken Road" },
                { value: "drainage", label: "Drainage" },
                { value: "garbage", label: "Garbage" },
                { value: "water_leakage", label: "Water Leakage" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {paginated.map((complaint) => (
          <Card
            key={complaint.id}
            className="hover:shadow-md transition cursor-pointer"
            onClick={() =>
              router.push(`/citizen/complaints/${complaint.id}`)
            }
          >
            <CardContent className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {complaint.subject}
                </h3>

                <p className="text-sm text-muted">
                  Ticket: {complaint.ticket_id}
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge size="sm">{complaint.category}</Badge>

                  {complaint.priority && (
                    <Badge size="sm" variant="outline">
                      {complaint.priority}
                    </Badge>
                  )}

                  
                </div>

                {complaint.authority_name && (
                  <p className="text-xs mt-1 text-muted">
                    Assigned to: {complaint.authority_name}
                  </p>
                )}
              </div>

              <span className="text-xs text-muted">
                {new Date(
                  complaint.created_at
                ).toLocaleDateString()}
              </span>
            </CardContent>
          </Card>
        ))}

        {paginated.length === 0 && (
          <div className="text-center py-12 text-muted">
            No complaints found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}