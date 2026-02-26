"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/login");
            return;
        }
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Wrong role — redirect to appropriate dashboard
            if (user.role === "citizen") {
                router.replace("/citizen/dashboard");
            } else {
                router.replace("/admin/dashboard");
            }
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-fg-secondary">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-fg-secondary">Access denied. Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
