"use client";

import { useEffect, useState } from "react";
import { getComplaintById } from "@/services/complaint.service";
import { useParams } from "next/navigation";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getComplaintById(id as string)
      .then(res => setData(res.data));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold">{data.subject}</h1>
      <p className="text-gray-600">{data.description}</p>

      <div className="mt-6">
        <h2 className="font-semibold">Updates</h2>
        {data.updates.map((u: any) => (
          <div key={u.id} className="border p-3 rounded mt-2">
            <div>{u.status}</div>
            <div>{u.remarks}</div>
            <div className="text-xs text-gray-500">
              By {u.updated_by_name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}