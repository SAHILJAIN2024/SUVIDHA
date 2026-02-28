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
    <div className="min-h-screen bg-gray-100 p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.email}
        </h1>

        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            My Complaints
          </h2>

          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="space-y-6">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border border-gray-100 p-6 md:p-8 rounded-xl hover:shadow-md transition bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <h3 className="font-semibold text-lg text-gray-900">
                    {complaint.title}
                  </h3>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center">
                    <p className="text-sm px-4 py-1.5 rounded-full border bg-white border-gray-200 shadow-sm inline-flex font-medium text-gray-700">
                      Status: {complaint.status}
                    </p>
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {new Date(
                        complaint.createdAt
                      ).toLocaleString()}
                    </p>
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