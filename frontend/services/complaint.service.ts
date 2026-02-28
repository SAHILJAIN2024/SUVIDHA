import { Complaint } from "@/types";

const API_BASE = "http://localhost:5000/api";

/* -------------------------------- */
/* Helper: Handle JSON + Errors */
/* -------------------------------- */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }
  return res.json();
}

/* -------------------------------- */
/* CREATE COMPLAINT */
/* -------------------------------- */
export const createComplaint = async (formData: FormData) => {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: "POST",
    body: formData,
    credentials: "include", // send HTTP-only cookie
    mode: "cors",           // cross-origin requests
  });

  const data = await handleResponse<{ success: boolean; message: string; ticketId: string; complaintId: number }>(res);
  return data;
};

/* -------------------------------- */
/* GET MY COMPLAINTS */
/* -------------------------------- */
export const getMyComplaints = async (): Promise<Complaint[]> => {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: "GET",
    credentials: "include",
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; data: Complaint[] }>(res);

  return data.data.map((c: Complaint) => ({ ...c, id: String(c.id) }));
};

/* -------------------------------- */
/* GET PUBLIC COMPLAINTS */
/* -------------------------------- */
export const getPublicComplaints = async (params?: Record<string, any>): Promise<Complaint[]> => {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";

  const res = await fetch(`${API_BASE}/complaints/public${query}`, {
    method: "GET",
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; data: Complaint[] }>(res);
  return data.data.map((c: Complaint) => ({ ...c, id: String(c.id) }));
};

/* -------------------------------- */
/* GET ALL COMPLAINTS (ADMIN) */
/* -------------------------------- */
export const getComplaints = async (): Promise<Complaint[]> => {
  const res = await fetch(`${API_BASE}/complaints/all`, {
    method: "GET",
    credentials: "include",
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; data: Complaint[] }>(res);
  return data.data.map((c: Complaint) => ({ ...c, id: String(c.id) }));
};

/* -------------------------------- */
/* GET ONE COMPLAINT BY ID */
/* -------------------------------- */
export const getComplaintById = async (id: string): Promise<Complaint> => {
  const res = await fetch(`${API_BASE}/complaints/${id}`, {
    method: "GET",
    credentials: "include",
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; data: Complaint }>(res);
  return { ...data.data, id: String(data.data.id) };
};

/* -------------------------------- */
/* UPDATE COMPLAINT */
/* -------------------------------- */
export const updateComplaint = async (id: string, body: any) => {
  const res = await fetch(`${API_BASE}/complaints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
    mode: "cors",
  });

  return handleResponse<{ success: boolean; message: string }>(res);
};

/* -------------------------------- */
/* VOTE COMPLAINT */
/* -------------------------------- */
export const voteComplaint = async (id: string) => {
  const res = await fetch(`${API_BASE}/complaints/${id}/vote`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
  });

  return handleResponse<{ success: boolean; message: string }>(res);
};