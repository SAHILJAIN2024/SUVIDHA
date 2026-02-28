"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface Complaint {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function UserDashboard() {
  const router = useRouter();

  const { user, token, isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("AUTH STATE:", { user, isAuthenticated, hasHydrated });

  // 🔐 Auth Guard
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

    loadDashboard();
  }, [hasHydrated, isAuthenticated, user]);

  // 📦 Load user complaints
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/complaints/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Dashboard fetch failed:", data);
        return;
      }

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.email}
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            My Complaints
          </h2>

          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border p-4 rounded-lg hover:shadow-md transition"
                >
                  <h3 className="font-semibold">
                    {complaint.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status: {complaint.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}