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
    ChevronLeft,
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

const navItems = [
    { href: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/citizen/complaints", label: "Complaints", icon: FileText },
    { href: "/citizen/complaints/global", label: "Global Feed", icon: Globe },
    { href: "/citizen/bills", label: "Bill Payments", icon: CreditCard },
    { href: "/citizen/services", label: "Services", icon: Briefcase },
    { href: "/citizen/documents", label: "Documents", icon: ShieldCheck },
    { href: "/citizen/notifications", label: "Notifications", icon: Bell },
    { href: "/citizen/profile", label: "Profile", icon: User },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { sidebarCollapsed, toggleSidebarCollapse, theme, setTheme } = useUIStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const displayName = user?.name || "Citizen";
    const displayEmail = user?.email || "citizen@suvidha.gov";

    return (
        <AuthGuard allowedRoles={["citizen"]}>
            <div className="min-h-screen bg-bg flex overflow-hidden">
                {/* ── Desktop Sidebar (sticky, in-flow) ────────── */}
                <aside
                    className={cn(
                        "hidden lg:flex flex-col shrink-0 sticky top-0 h-screen bg-surface border-r border-border transition-all duration-300 z-40 overflow-hidden",
                        sidebarCollapsed ? "w-[72px]" : "w-64"
                    )}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
                        {!sidebarCollapsed && (
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm">
                                    S
                                </div>
                                <span className="font-bold text-fg whitespace-nowrap">SUVIDHA</span>
                            </Link>
                        )}
                        <button
                            onClick={toggleSidebarCollapse}
                            className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                        >
                            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
                        </button>
                    </div>

                    {/* Nav Items */}
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
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-600")} />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="border-t border-border p-3 space-y-1 shrink-0">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-fg-secondary hover:text-fg hover:bg-surface-muted transition-colors whitespace-nowrap"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                            {!sidebarCollapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors whitespace-nowrap"
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {!sidebarCollapsed && "Sign Out"}
                        </button>
                    </div>
                </aside>

                {/* ── Mobile Sidebar (overlay) ────────────────── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={() => setMobileOpen(false)}
                            />
                            <motion.aside
                                initial={{ x: -288 }}
                                animate={{ x: 0 }}
                                exit={{ x: -288 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border lg:hidden flex flex-col"
                            >
                                <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm">
                                            S
                                        </div>
                                        <span className="font-bold text-fg">SUVIDHA</span>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-fg-muted hover:text-fg">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary-50 text-primary-700"
                                                        : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="border-t border-border p-3 shrink-0">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main Content ────────────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-semibold text-fg capitalize">
                                    {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link href="/citizen/notifications" className="relative p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                            </Link>
                            <button className="hidden sm:block p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                            <div className="h-8 w-px bg-border mx-1 hidden sm:block" />
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {displayName.charAt(0)}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-fg leading-none">{displayName}</p>
                                    <p className="text-xs text-fg-muted mt-0.5">{displayEmail}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
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
