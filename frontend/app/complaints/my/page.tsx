"use client";

import { useEffect, useState } from "react";
import { getMyComplaints } from "@/services/complaint.service";
import Link from "next/link";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getMyComplaints().then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Complaints</h1>

      {complaints.map((c: any) => (
        <Link key={c.id} href={`/complaints/${c.id}`}>
          <div className="border p-4 rounded-lg mb-4 hover:shadow">
            <div className="font-semibold">{c.subject}</div>
            <div className="text-sm text-gray-500">{c.status}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}