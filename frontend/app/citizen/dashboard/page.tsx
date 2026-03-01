"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface Complaint {
  id: number;
  ticket_id: string;
  subject: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
}

export default function UserDashboard() {
  const router = useRouter();

  const { user, token, isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || !token) {
      router.replace("/auth/login");
      return;
    }

    if (user?.role !== "user") {
      router.replace(
        user?.role === "admin"
          ? "/admin/dashboard"
          : "/auth/login"
      );
      return;
    }

    fetchDashboard();
  }, [hasHydrated, isAuthenticated, user]);

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://suvidha-qxz1.onrender.com/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ---------------- STATS ---------------- */
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  /* ---------------- LOADING ---------------- */
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Initializing...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "user") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome */}
        <h1 className="text-3xl font-bold">
          Welcome, {user?.email}
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">Resolved</p>
            <h2 className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </h2>
          </div>
        </div>

        {/* Complaint List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Recent Complaints
          </h2>

          {loading ? (
            <p>Loading complaints...</p>
          ) : error ? (
            <div>
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchDashboard}
                className="mt-3 text-blue-600 underline"
              >
                Retry
              </button>
            </div>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div
                  key={complaint.id}
                  className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/citizen/complaints/${complaint.id}`
                    )
                  }
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {complaint.subject}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {new Date(
                        complaint.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-2 text-sm text-gray-600">
                    <span>#{complaint.ticket_id}</span>
                    <span>{complaint.category}</span>
                    <span className="capitalize">
                      {complaint.status.replace("_", " ")}
                    </span>
                    {complaint.priority && (
                      <span>{complaint.priority}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}