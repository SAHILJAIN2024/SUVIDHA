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
    { href: "/citizen/dashboard", id: "nav.dashboard", icon: LayoutDashboard },
    { href: "/citizen/complaints", id: "nav.complaints", icon: FileText },
    { href: "/citizen/complaints/global", id: "nav.globalFeed", icon: Globe },
    { href: "/citizen/bills", id: "nav.billPayments", icon: CreditCard },
    { href: "/citizen/services", id: "nav.services", icon: Briefcase },
    { href: "/citizen/documents", id: "nav.documents", icon: ShieldCheck },
    { href: "/citizen/notifications", id: "nav.notifications", icon: Bell },
    { href: "/citizen/profile", id: "nav.profile", icon: User },
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

    return (
        <AuthGuard allowedRoles={["user"]}>
            <div className="min-h-screen w-full bg-bg flex flex-col">

                {/* ── Top Navigation Bar ────── */}
                <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-border shadow-sm">
                    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                        {/* Left: Brand + Mobile Menu Button */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                <Menu className="h-5 w-5" />
                            </button>

                            <Link href="/citizen/dashboard" className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                    S
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-bold text-fg text-sm whitespace-nowrap block leading-none">SUVIDHA</span>
                                    <span className="text-[10px] text-fg-muted uppercase tracking-wider block mt-0.5">Citizen Portal</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation — visible md+, scrollable if needed */}
                        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 mx-2 lg:mx-4 flex-1 overflow-x-auto scrollbar-none">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0",
                                            isActive
                                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                        )}
                                    >
                                        <item.icon className={cn("h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0", isActive && "text-primary-600")} />
                                        <span>{t(item.id)}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Actions & Profile */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <div className="hidden md:flex items-center gap-2 pr-4 border-r border-border">
                                <LanguageSelector />
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors"
                                    title={t(theme === "dark" ? "nav.lightMode" : "nav.darkMode")}
                                >
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>
                                <Link href="/citizen/notifications" className="relative p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                                </Link>
                            </div>

                            {/* Profile & Logout */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-fg leading-none">{displayName}</p>
                                    <p className="text-xs text-fg-muted mt-1">{displayEmail}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
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
                                className="fixed inset-y-0 left-0 z-[60] w-72 bg-surface border-r border-border lg:hidden flex flex-col shadow-2xl"
                            >
                                <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm">S</div>
                                        <span className="font-bold text-fg">SUVIDHA</span>
                                    </div>
                                    <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-fg-muted hover:text-fg bg-surface-muted"><X className="h-5 w-5" /></button>
                                </div>
                                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                                                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                                    isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300" : "text-fg-secondary hover:text-fg hover:bg-surface-muted"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span>{t(item.id)}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="border-t border-border p-3 space-y-2 shrink-0 bg-surface-muted/30">
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <LanguageSelector />
                                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg text-fg-secondary hover:text-fg hover:bg-surface-muted transition-colors">
                                            {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                                        </button>
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors whitespace-nowrap">
                                        <LogOut className="h-5 w-5 shrink-0" /> {t("nav.signOut")}
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main Content Area ────── */}
                <main className="flex-1 w-full overflow-x-hidden bg-surface-muted/30">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                        {children}
                    </div>
                </main>

            </div>
        </AuthGuard>
    );
}
