"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user,} = useAuthStore();

  useEffect(() => {

    // Not logged in
    if (!isAuthenticated || !user) {
      if (pathname !== "/auth/login") {
        router.replace("/auth/login");
      }
      return;
    }

    // Role restriction
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const correctDashboard =
        user.role === "admin"
          ? "/admin/dashboard"
          : "/citizen/dashboard";

      if (pathname !== correctDashboard) {
        router.replace(correctDashboard);
      }
    }
  }, [isAuthenticated, user, allowedRoles, router, pathname]);


  /*
    BLOCK IF NOT AUTHENTICATED
  */
  if (!isAuthenticated || !user) {
    return null;
  }

  /*
    BLOCK IF ROLE NOT ALLOWED
  */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}