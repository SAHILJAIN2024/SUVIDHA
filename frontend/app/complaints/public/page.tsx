"use client";

import { useEffect, useState } from "react";
import { getPublicComplaints } from "@/services/complaint.service";

export default function PublicPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPublicComplaints({ page, limit: 10 })
      .then(res => setData(res.data));
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Public Complaints</h1>

      {data.map((c) => (
        <div key={c.ticket_id} className="border p-4 rounded-lg mb-4">
          <div className="font-semibold">{c.subject}</div>
          <div className="text-sm">{c.category} • {c.status}</div>
          <div className="text-xs text-gray-500">
            Assigned: {c.authority_name || "Not assigned"}
          </div>
        </div>
      ))}

      <button onClick={() => setPage(p => p + 1)} className="btn-primary mt-4">
        Load More
      </button>
    </div>
  );
}