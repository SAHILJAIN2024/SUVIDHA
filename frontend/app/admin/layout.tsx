"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !isAuthenticated ) {
      router.replace("/auth/login");
    }
  }, [token, isAuthenticated, user, router]);

  return <>{children}</>;
}