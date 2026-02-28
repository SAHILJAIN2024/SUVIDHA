import { User } from "@/types";

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    credentials: "include", // important if backend sets HTTP-only cookie
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return { user: data.user, token: data.token };
}

// Fetch the current user from backend using token
export async function getCurrentUser(token?: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data.user;
}