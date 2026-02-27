"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [token, isAuthenticated, router]);

  return <>{children}</>;
}