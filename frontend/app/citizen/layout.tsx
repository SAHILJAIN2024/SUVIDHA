"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    User,
    Briefcase,
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    Sun,
    Moon,
    ShieldCheck,
    Globe,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useI18nStore } from "@/store/i18n.store";
import { LanguageSelector } from "@/components/LanguageSelector";

const navItems = [
    { href: "/citizen/dashboard", id: "nav.dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/citizen/complaints", id: "nav.complaints", icon: FileText, label: "Complaints" },
    { href: "/citizen/complaints/global", id: "nav.globalFeed", icon: Globe, label: "Global Feed" },
    { href: "/citizen/bills", id: "nav.billPayments", icon: CreditCard, label: "Bills" },
    { href: "/citizen/services", id: "nav.services", icon: Briefcase, label: "Services" },
    { href: "/citizen/documents", id: "nav.documents", icon: ShieldCheck, label: "Documents" },
    { href: "/citizen/notifications", id: "nav.notifications", icon: Bell, label: "Notifications" },
    { href: "/citizen/profile", id: "nav.profile", icon: User, label: "Profile" },
] as const;

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useUIStore();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useI18nStore();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const displayName = user?.name || "Citizen";
    const displayEmail = user?.email || "citizen@suvidha.gov";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <AuthGuard allowedRoles={["user"]}>
            {/* FIX: Removed overflow-x-hidden from here. It forces overflow-y to auto and clips dropdowns! */}
            <div className="min-h-screen w-full bg-bg flex flex-col">

                {/* ════════════════════════════════════
                    TOP NAVIGATION BAR
                ════════════════════════════════════ */}
                <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
                    <div className="w-full px-3 sm:px-5 lg:px-8 h-14 sm:h-16 flex items-center gap-2 sm:gap-3">

                        {/* ── Hamburger (mobile only) ── */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted border border-border/60 transition-all shrink-0"
                        >
                            <Menu className="h-4.5 w-4.5" />
                        </button>

                        {/* ── Brand ── */}
                        <Link href="/citizen/dashboard" className="flex items-center gap-2.5 shrink-0 group">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform">
                                S
                            </div>
                            <div className="hidden sm:block leading-none">
                                <span className="font-extrabold text-fg text-sm tracking-tight block">SUVIDHA</span>
                                <span className="text-[9px] text-fg-muted uppercase tracking-[0.12em] block mt-0.5">Citizen Portal</span>
                            </div>
                        </Link>

                        {/* ── Desktop Nav (md+) ── */}
                        <nav
                            aria-label="Primary"
                            className="hidden md:flex flex-1 min-w-0 items-center gap-4 overflow-x-auto scrollbar-none px-1"
                        >
                            {navItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/citizen/complaints" && pathname.startsWith(item.href + "/"));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap shrink-0 text-xs lg:text-sm",
                                            isActive
                                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0",
                                                isActive ? "text-primary-600" : "text-fg-muted"
                                            )}
                                        />
                                        <span>{t(item.id)}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* ── Right Actions ── */}
                        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
                            {/* Language + Theme + Notifications — desktop only */}
                            <div className="hidden md:flex items-center gap-1 border-r border-border/60 pr-2 mr-1">

                                {/* FIX: Added a relative wrapper with a high z-index here */}
                                <div className="relative z-50">
                                    <LanguageSelector />
                                </div>

                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted transition-all"
                                    title={t(theme === "dark" ? "nav.lightMode" : "nav.darkMode")}
                                >
                                    {theme === "dark"
                                        ? <Sun className="h-4 w-4" />
                                        : <Moon className="h-4 w-4" />
                                    }
                                </button>
                                <Link
                                    href="/citizen/notifications"
                                    className="relative p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted transition-all"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger-500 rounded-full ring-2 ring-bg" />
                                </Link>
                            </div>

                            {/* Profile info (desktop) */}
                            <div className="hidden lg:block text-right mr-1 leading-none">
                                <p className="text-xs font-semibold text-fg truncate max-w-[120px]">{displayName}</p>
                                <p className="text-[10px] text-fg-muted mt-0.5 truncate max-w-[120px]">{displayEmail}</p>
                            </div>

                            {/* Avatar / Logout */}
                            <button
                                onClick={handleLogout}
                                title={t("nav.signOut")}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-extrabold hover:scale-105 hover:shadow-md hover:shadow-primary-500/30 transition-all shrink-0"
                            >
                                {initial}
                            </button>
                        </div>
                    </div>
                </header>

                {/* ════════════════════════════════════
                    MOBILE SIDEBAR OVERLAY
                ════════════════════════════════════ */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                                onClick={() => setMobileOpen(false)}
                            />

                            {/* Drawer */}
                            <motion.aside
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                                className="fixed inset-y-0 left-0 z-[60] w-72 bg-surface border-r border-border md:hidden flex flex-col shadow-2xl"
                            >
                                {/* Drawer header */}
                                <div className="h-14 sm:h-16 flex items-center justify-between px-4 border-b border-border/60 shrink-0">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-primary-500/30">
                                            S
                                        </div>
                                        <div className="leading-none">
                                            <span className="font-extrabold text-fg text-sm block">SUVIDHA</span>
                                            <span className="text-[9px] text-fg-muted uppercase tracking-[0.12em] block mt-0.5">Citizen Portal</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="p-1.5 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted border border-border/60 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Drawer nav */}
                                <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/citizen/complaints" && pathname.startsWith(item.href + "/"));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all",
                                                    isActive
                                                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                        : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                                    isActive
                                                        ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30"
                                                        : "bg-surface-muted text-fg-muted"
                                                )}>
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <span>{t(item.id)}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Drawer footer */}
                                <div className="border-t border-border/60 p-3 space-y-1 shrink-0 bg-surface-muted/30 relative z-50">
                                    <div className="flex items-center justify-between px-2 py-2">

                                        {/* FIX: Added relative wrapper for mobile as well */}
                                        <div className="relative z-50">
                                            <LanguageSelector />
                                        </div>

                                        <button
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                            className="p-2 rounded-xl text-fg-secondary hover:text-fg hover:bg-surface-muted transition-all"
                                        >
                                            {theme === "dark"
                                                ? <Sun className="h-4 w-4" />
                                                : <Moon className="h-4 w-4" />
                                            }
                                        </button>
                                    </div>
                                    {/* User info strip */}
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-muted/50 border border-border/40">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
                                            {initial}
                                        </div>
                                        <div className="min-w-0 leading-none">
                                            <p className="text-xs font-semibold text-fg truncate">{displayName}</p>
                                            <p className="text-[10px] text-fg-muted mt-0.5 truncate">{displayEmail}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-danger-50 dark:bg-danger-500/10 shrink-0">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        {t("nav.signOut")}
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ════════════════════════════════════
                    MAIN CONTENT AREA
                ════════════════════════════════════ */}
                <main className="flex-1 w-full bg-bg overflow-x-hidden flex flex-col">
                    {/* FIX: 
                      1. Removed max-w-7xl to allow 100% width.
                      2. Removed padding (px/py) to allow edge-to-edge rendering.
                      3. Kept flex-1 and centering utilities so content stays in the middle.
                    */}
                    <div className="w-full flex-1 flex flex-col items-center justify-center">
                        {children}
                    </div>
                </main>

            </div>
        </AuthGuard>
    );
}