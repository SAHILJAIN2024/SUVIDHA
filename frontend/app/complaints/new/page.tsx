"use client";

import { useState } from "react";
import { createComplaint } from "@/services/complaint.service";
import { useRouter } from "next/navigation";

export default function NewComplaintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await createComplaint(formData);
      alert(`Complaint filed! Ticket: ${res.ticketId}`);
      router.push("/complaints/my");
    } catch (err) {
      alert("Failed to file complaint");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">File Complaint</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select name="category" required className="input">
          <option value="">Select Category</option>
          <option value="electricity">Electricity</option>
          <option value="water">Water</option>
          <option value="roads">Roads</option>
          <option value="sanitation">Sanitation</option>
        </select>

        <input name="complaint_type" placeholder="Complaint Type" required className="input" />

        <input name="subject" placeholder="Subject" required className="input" />

        <textarea name="description" placeholder="Description" required className="input" />

        <input name="location" placeholder="Location" required className="input" />

        <input type="number" name="latitude" placeholder="Latitude" className="input" />

        <input type="number" name="longitude" placeholder="Longitude" className="input" />

        <input type="file" name="image" />

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}