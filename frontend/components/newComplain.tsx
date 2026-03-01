"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, Button, Input, Select } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

export default function CreateComplaintForm() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [formData, setFormData] = useState({
    category: "",
    complaint_type: "",
    subject: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("https://suvidha-qxz1.onrender.com/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      // 🔥 Handle express-validator errors properly
      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map((e: any) => e.msg).join(", "));
        }
        throw new Error(data.message || "Failed to create complaint");
      }

      // Success
      router.push("/citizen/complaints");

    } catch (err: any) {
      console.error("Create complaint error:", err);
      setError(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">Create New Complaint</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to submit your complaint.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CATEGORY — MUST MATCH BACKEND EXACTLY */}
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select Category" },
              { value: "street_light", label: "Street Light" },
              { value: "pothole", label: "Pothole" },
              { value: "broken_road", label: "Broken Road" },
              { value: "drainage", label: "Drainage" },
              { value: "garbage", label: "Garbage" },
              { value: "water_leakage", label: "Water Leakage" },
            ]}
          />

          {/* Complaint Type — must match backend enum */}
          <Select
            name="complaint_type"
            value={formData.complaint_type}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select Type" },
              { value: "personal", label: "Personal" },
              { value: "global", label: "Global" },
            ]}
          />

          <Input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <Input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}