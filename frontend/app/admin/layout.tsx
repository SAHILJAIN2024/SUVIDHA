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
    Map,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Bell,
    Settings,
    Shield,
    Sun,
    Moon,
    Users,
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
    { href: "/admin/map", id: "admin.wardMap", icon: Map },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { sidebarCollapsed, toggleSidebarCollapse, theme, setTheme } = useUIStore();
    const { t } = useI18nStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const displayName = user?.name || "Admin";
    const displayRole = user?.role || "admin-electricity";

    return (
        <AuthGuard allowedRoles={["admin-electricity", "admin-water", "admin-roads", "admin-sanitation", "super-admin"]}>
            <div className="min-h-screen bg-bg flex overflow-hidden">
                {/* ── Desktop Sidebar (sticky, in-flow) ────── */}
                <aside
                    className={cn(
                        "hidden lg:flex flex-col shrink-0 sticky top-0 h-screen bg-surface border-r border-border transition-all duration-300 z-40 overflow-hidden",
                        sidebarCollapsed ? "w-[72px]" : "w-64"
                    )}
                >
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
                        {!sidebarCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-700 to-primary-900 text-white font-bold flex items-center justify-center text-sm">
                                    S
                                </div>
                                <div>
                                    <span className="font-bold text-fg text-sm whitespace-nowrap">SUVIDHA</span>
                                    <p className="text-[10px] text-fg-muted uppercase tracking-wider whitespace-nowrap">Admin Panel</p>
                                </div>
                            </div>
                        )}
                        <button onClick={toggleSidebarCollapse} className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
                        </button>
                    </div>

                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                        isActive
                                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                            : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                    )}
                                    title={sidebarCollapsed ? t(item.id as any) : undefined}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-600")} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1">{t(item.id as any)}</span>
                                            {item.badge && (
                                                <Badge variant="danger" size="sm">{item.badge}</Badge>
                                            )}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-border p-3 space-y-1 shrink-0">
                        <LanguageSelector collapsed={sidebarCollapsed} />
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-fg-secondary hover:text-fg hover:bg-surface-muted transition-colors whitespace-nowrap"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                            {!sidebarCollapsed && t(theme === "dark" ? "nav.lightMode" : "nav.darkMode")}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors whitespace-nowrap"
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {!sidebarCollapsed && t("nav.signOut")}
                        </button>
                    </div>
                </aside>

                {/* ── Mobile Sidebar (overlay) ────── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                            <motion.aside
                                initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border lg:hidden flex flex-col"
                            >
                                <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-700 to-primary-900 text-white font-bold flex items-center justify-center text-sm">S</div>
                                        <span className="font-bold text-fg">Admin Panel</span>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-fg-muted hover:text-fg"><X className="h-5 w-5" /></button>
                                </div>
                                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                                                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                                    isActive ? "bg-primary-50 text-primary-700" : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="flex-1">{t(item.id as any)}</span>
                                                {item.badge && <Badge variant="danger" size="sm">{item.badge}</Badge>}
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="border-t border-border p-3 space-y-1 shrink-0">
                                    <LanguageSelector />
                                    <button
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-fg-secondary hover:text-fg hover:bg-surface-muted transition-colors whitespace-nowrap"
                                    >
                                        {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                                        {t(theme === "dark" ? "nav.lightMode" : "nav.darkMode")}
                                    </button>
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors whitespace-nowrap">
                                        <LogOut className="h-5 w-5 shrink-0" /> {t("nav.signOut")}
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main ────── */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="hidden sm:flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary-600" />
                                <h1 className="text-lg font-semibold text-fg capitalize">{pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button className="relative p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                            </button>
                            <div className="h-8 w-px bg-border hidden sm:block" />
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {displayName.charAt(0)}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-fg leading-none">{displayName}</p>
                                    <p className="text-xs text-fg-muted mt-0.5 capitalize">{displayRole.replace("admin-", "")}</p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
                        <div className="max-w-6xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
