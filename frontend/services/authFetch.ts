import { useAuthStore } from "@/store/auth.store";

export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  return res.json();
};