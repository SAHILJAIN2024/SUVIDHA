"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ListChecks,
    BarChart3,
    Map as MapIcon,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    Sun,
    Moon,
    FolderCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useI18nStore } from "@/store/i18n.store";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Badge } from "@/components/ui";

interface NavItem {
    href: string;
    id: string;
    icon: any;
    badge?: string;
}

const navItems: NavItem[] = [
    { href: "/admin/dashboard", id: "admin.dashboard", icon: LayoutDashboard },
    { href: "/admin/queue", id: "admin.actionQueue", icon: ListChecks, badge: "3" },
    { href: "/admin/complaints", id: "admin.allComplaints", icon: FileText },
    { href: "/admin/documents", id: "admin.docVerification", icon: FolderCheck },
    { href: "/admin/reports", id: "admin.reports", icon: BarChart3 },
    { href: "/admin/map", id: "admin.wardMap", icon: MapIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useUIStore(); // removed sidebarCollapsed as it's no longer needed
    const { t } = useI18nStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const displayName = user?.name || "Admin";
    const displayRole = user?.role || "admin-electricity";

    return (
        <AuthGuard allowedRoles={["admin-electricity", "admin-water", "admin", "admin-sanitation", "super-admin"]}>
            {/* Changed to flex-col for top-to-bottom layout */}
            <div className="min-h-screen bg-bg flex flex-col">

                {/* ── Top Navigation Bar ────── */}
                <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
                    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                        {/* Left: Brand & Mobile Menu Button */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Menu className="h-5 w-5" />
                            </button>

                            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform">
                                    S
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-bold text-fg text-sm whitespace-nowrap block leading-none">SUVIDHA</span>
                                    <span className="text-[10px] text-fg-muted uppercase tracking-wider block mt-0.5">Admin Panel</span>
                                </div>
                            </Link>
                        </div>

                        {/* Left: Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 mx-4 flex-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                                            isActive
                                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-600" : "text-fg-muted group-hover:text-fg transition-colors")} />
                                        <span>{t(item.id as any)}</span>
                                        {item.badge && (
                                            <Badge variant="danger" size="sm" className="ml-1 h-5 px-1.5 flex items-center justify-center rounded-full">
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active-dot"
                                                className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary-600"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Actions & Profile */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="hidden lg:flex items-center gap-2 pr-3 border-r border-border/60">
                                <LanguageSelector />
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                                    title={t(theme === "dark" ? "nav.lightMode" : "nav.darkMode")}
                                >
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>
                                <button className="relative p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-surface" />
                                </button>
                            </div>

                            {/* Profile Dropdown / Info */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-fg leading-none">{displayName}</p>
                                    <p className="text-xs text-fg-muted mt-1 capitalize">{displayRole.replace("admin-", "")}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary-500/30 hover:scale-105 transition-all"
                                    title={t("nav.signOut")}
                                >
                                    {displayName.charAt(0)}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Mobile Sidebar (overlay) ────── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
                            <motion.aside
                                initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-y-0 left-0 z-[60] w-72 bg-surface border-r border-border/60 lg:hidden flex flex-col shadow-2xl"
                            >
                                <div className="h-16 flex items-center justify-between px-4 border-b border-border/60 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-primary-500/30">S</div>
                                        <span className="font-bold text-fg">SUVIDHA</span>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-xl text-fg-muted hover:text-fg bg-surface-muted transition-colors"><X className="h-5 w-5" /></button>
                                </div>
                                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                                                className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                                    isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300" : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                        isActive ? "bg-primary-100 text-primary-600" : "text-fg-muted"
                                                    )}>
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <span>{t(item.id as any)}</span>
                                                </div>
                                                {item.badge && <Badge variant="danger" size="sm" className="rounded-full">{item.badge}</Badge>}
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="border-t border-border/60 p-3 space-y-1.5 shrink-0 bg-surface-muted/30">
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <LanguageSelector />
                                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl text-fg-secondary hover:text-fg hover:bg-surface-muted transition-colors">
                                            {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                                        </button>
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors whitespace-nowrap">
                                        <LogOut className="h-5 w-5 shrink-0" /> {t("nav.signOut")}
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main Content Area ────── */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg">
                    <div className="max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>
                </main>

            </div>
        </AuthGuard>
    );
}