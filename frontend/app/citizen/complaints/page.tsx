"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ChevronUp,
  ArrowUpRight,
  Zap,
  Droplets,
  Route,
  Recycle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, Button, Badge, StatusBadge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import {
  getMyComplaints,
  voteComplaint,
} from "@/services/complaint.service";
import { Complaint } from "@/types";
import { useGSAP } from "@/hooks/useGSAP";

const ITEMS_PER_PAGE = 5;

const deptIcons: Record<string, React.ReactNode> = {
  electricity: <Zap className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
  roads: <Route className="h-4 w-4" />,
  sanitation: <Recycle className="h-4 w-4" />,
};

const deptColors: Record<string, string> = {
  electricity: "#F59E0B",
  water: "#3B82F6",
  roads: "#8B5CF6",
  sanitation: "#10B981",
};

export default function ComplaintsPage() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [page, setPage] = useState(1);

  const gsapRef = useGSAP<HTMLDivElement>(".gsap-item", {
    y: 14,
    stagger: 0.04,
  });

  /* ------------------ AUTH + FETCH ------------------ */
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!authRes.ok) {
          router.replace("/auth/login");
          return;
        }

        const data = await getMyComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  /* ------------------ VOTE ------------------ */
  const handleVote = async (id: string) => {
    try {
      const updated = await voteComplaint(id);
      if (!updated) return;

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, votes: updated.votes, hasVoted: true }
            : c
        )
      );
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  /* ------------------ FILTER ------------------ */
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;

      const matchDept =
        deptFilter === "all" || c.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [complaints, search, statusFilter, deptFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ------------------ STATES ------------------ */
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

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-10 w-10 text-danger-500 mx-auto mb-3" />
        <p>{error}</p>
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div ref={gsapRef} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Complaints</h1>
          <p className="text-fg-secondary">
            {complaints.length} complaints total
          </p>
        </div>

        <Link href="/citizen/complaints/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search..."
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
                { value: "in-progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "rejected", label: "Rejected" },
                { value: "escalated", label: "Escalated" },
              ]}
            />

            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: "all", label: "All Departments" },
                { value: "electricity", label: "Electricity" },
                { value: "water", label: "Water" },
                { value: "roads", label: "Roads" },
                { value: "sanitation", label: "Sanitation" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {paginated.map((complaint) => (
          <Card key={complaint.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {complaint.title}
                </h3>
                <p className="text-sm text-muted">
                  {complaint.description}
                </p>

                <div className="flex gap-2 mt-2">
                  <StatusBadge
                    status={complaint.status}
                    size="sm"
                  />
                  <Badge size="sm">{complaint.ward}</Badge>
                </div>
              </div>

              <button
                onClick={() =>
                  !complaint.hasVoted &&
                  handleVote(complaint.id)
                }
                disabled={complaint.hasVoted}
                className="flex flex-col items-center"
              >
                <ChevronUp className="h-4 w-4" />
                <span>{complaint.votes}</span>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>

          {Array.from({ length: totalPages }).map(
            (_, i) => (
              <Button
                key={i}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            )
          )}

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