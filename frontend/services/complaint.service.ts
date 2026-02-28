import { authFetch } from "./authFetch";
import { Complaint } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  const { useAuthStore } = await import("@/store/auth.store");
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_BASE}/complaints`, {
    method: "POST",
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; message: string; ticketId: string; complaintId: number }>(res);
  return data;
};

/* -------------------------------- */
/* GET MY COMPLAINTS */
/* -------------------------------- */
export const getMyComplaints = async (): Promise<any> => {
  const res = await authFetch(`${API_BASE}/complaints/my`);
  return {
    ...res,
    data: (res.data || []).map((c: any) => ({ ...c, id: String(c.id) }))
  };
};

/* -------------------------------- */
/* GET PUBLIC COMPLAINTS */
/* -------------------------------- */
export const getPublicComplaints = async (params?: Record<string, any>): Promise<any> => {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";

  const res = await fetch(`${API_BASE}/complaints/public${query}`, {
    method: "GET",
    mode: "cors",
  });

  const data = await handleResponse<{ success: boolean; data: Complaint[] }>(res);
  return {
    ...data,
    data: (data.data || []).map((c: Complaint) => ({ ...c, id: String(c.id) }))
  };
};

/* -------------------------------- */
/* GET ALL COMPLAINTS (ADMIN) */
/* -------------------------------- */
export const getComplaints = async (): Promise<any> => {
  const res = await authFetch(`${API_BASE}/complaints/all`);
  return {
    ...res,
    data: (res.data || []).map((c: any) => ({ ...c, id: String(c.id) }))
  };
};

/* -------------------------------- */
/* GET ONE COMPLAINT BY ID */
/* -------------------------------- */
export const getComplaintById = async (id: string): Promise<any> => {
  const res = await authFetch(`${API_BASE}/complaints/${id}`);
  return { 
    ...res,
    data: { 
      ...res.data, 
      id: String(res.data?.id || id),
      subject: res.data?.subject || res.data?.title,
      updates: res.data?.updates || [] 
    } 
  };
};

/* -------------------------------- */
/* UPDATE COMPLAINT */
/* -------------------------------- */
export const updateComplaint = async (id: string, body: any) => {
  return authFetch(`${API_BASE}/complaints/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/* -------------------------------- */
/* VOTE COMPLAINT */
/* -------------------------------- */
export const voteComplaint = async (id: string) => {
  return authFetch(`${API_BASE}/complaints/${id}/vote`, {
    method: "POST",
  });
};
