"use client";

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  FileText,
  BarChart3,
  ChevronRight,
  Smartphone,
  Map,
  Bell,
  CheckCircle,
  Droplets,
  Route,
  Recycle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";

/* ═══════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════ */




   
const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Smart Complaint System",
    description: "File, track, and resolve complaints with real-time status updates and AI-powered categorization.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Role-Based Access",
    description: "Secure RBAC for citizens, department admins, and super admins with department-level routing.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "GIS Ward Mapping",
    description: "Interactive ward maps with complaint heatmaps, infrastructure layers, and real-time tracking.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Multi-Utility Billing",
    description: "Unified bill payments for electricity, gas, water, and property tax with payment history.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "PWA + Kiosk Ready",
    description: "Installable on any device. Optimized for public kiosk hardware with auto-session management.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Admin Analytics",
    description: "Department-wise KPI dashboards, escalation tracking, and resolution time analytics.",
    color: "from-cyan-500 to-blue-600",
  },
];

const quickServices = [
  { icon: <Zap className="h-6 w-6" />, label: "Electricity", color: "#F59E0B", href: "/citizen/services/electricity", serviceKey: "electricity" },
  { icon: <Droplets className="h-6 w-6" />, label: "Water Supply", color: "#3B82F6", href: "/citizen/services/water", serviceKey: "water" },
  { icon: <Route className="h-6 w-6" />, label: "Roads", color: "#8B5CF6", href: "/citizen/services/roads", serviceKey: "roads" },
  { icon: <Recycle className="h-6 w-6" />, label: "Sanitation", color: "#10B981", href: "/citizen/services/sanitation", serviceKey: "sanitation" },
];

const howItWorksSteps = [
  { step: "01", title: "Register & Verify", description: "Create your account and verify with Aadhaar for instant access.", icon: <Users className="h-6 w-6" /> },
  { step: "02", title: "File a Complaint", description: "Describe the issue, tag the location on the map, and submit with photos.", icon: <FileText className="h-6 w-6" /> },
  { step: "03", title: "Track in Real-Time", description: "Get live updates as your complaint moves through departments.", icon: <Clock className="h-6 w-6" /> },
  { step: "04", title: "Resolution", description: "Receive notification when resolved. Rate the service quality.", icon: <Star className="h-6 w-6" /> },
];

const stats = [
  { value: "50K+", label: "Citizens Served" },
  { value: "12K+", label: "Complaints Resolved" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4", label: "Departments" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506905925200-84384a8dd1bd?auto=format&fit=crop&w=600&q=80",
];

/* ═══════════════════════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════════════════════════════════
   Scroll Reveal Wrapper
   ═══════════════════════════════════════════════════════════ */
function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Quick Service Card
   ═══════════════════════════════════════════════════════════ */
function QuickServiceCard({ service, isAuthenticated }: { service: typeof quickServices[0]; isAuthenticated: boolean }) {
  const href = isAuthenticated ? service.href : "/auth/register";
  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      // Will navigate via Link href
    }
  };

  return (
    <Link href={href} className="flex justify-center w-full">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full group flex flex-col items-center text-center gap-2 sm:gap-4 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-transparent hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer m-5"
        onClick={handleClick}
      >
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 mx-auto text-lg sm:text-2xl m-2.5"
          style={{ backgroundColor: service.color, boxShadow: `0 8px 20px -5px ${service.color}50` }}
        >
          {service.icon}
        </div>
        <span className="text-base sm:text-lg font-bold text-fg">{service.label}</span>
        <div className="flex items-center justify-center text-xs sm:text-sm font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
          <span className="hidden sm:inline">{isAuthenticated ? "Access Service" : "Register to Access"}</span>
          <span className="sm:hidden">{isAuthenticated ? "Access" : "Register"}</span>
          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // strict overflow-x-hidden prevents the gallery/ticker from causing horizontal scroll
    <div className="min-h-screen w-full bg-bg selection:bg-primary-500/30 overflow-x-hidden flex flex-col items-center">

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled
          ? "bg-bg/95 backdrop-blur-md shadow-sm py-3"
          : "bg-bg/80 backdrop-blur-sm py-5"
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shadow-sm transition-all duration-300 ${scrolled ? 'w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base' : 'w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg group-hover:scale-105'}`}>
                S
              </div>
              <span className={`font-bold text-fg tracking-tight transition-all duration-300 hidden sm:inline ${scrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>SUVIDHA</span>
            </Link>
            <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-fg-secondary">
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#stats" className="hover:text-primary-600 transition-colors">Impact</a>
              <a href="#services" className="hover:text-primary-600 transition-colors">Services</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <Link href="/auth/login" className="hidden sm:inline">
              <Button variant="ghost" size={scrolled ? "sm" : "md"} className="transition-all">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size={scrolled ? "sm" : "md"} rightIcon={<ArrowRight className="h-4 w-4" />} className="transition-all shadow-md text-xs sm:text-sm !pr-2 !pl-[18px] sm:!pr-4 sm:!pl-[26px]">
                Register
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-fg-secondary hover:text-primary-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden bg-bg/95 backdrop-blur-md border-b border-border/50"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 text-base font-semibold text-fg-secondary hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 text-base font-semibold text-fg-secondary hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">How It Works</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 text-base font-semibold text-fg-secondary hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Impact</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 text-base font-semibold text-fg-secondary hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Services</a>
            <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Sign In</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Spacing to account for fixed navbar */}
      <div className="h-16 sm:h-20 md:h-24 lg:h-28" />

      {/* ── Live Notification Ticker ─────────────────────── */}
      <div className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex w-max whitespace-nowrap items-center text-xs sm:text-sm font-medium tracking-wide"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {/* We duplicate the content to ensure a seamless loop */}
            {[1, 2].map((set) => (
              <div key={set} className="flex items-center">
                <span className="flex items-center mx-4 sm:mx-8"><AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" /> <span className="hidden sm:inline">Live Update:</span> Ward 4 water maintenance tomorrow 10 AM - 2 PM.</span>
                <span className="flex items-center mx-4 sm:mx-8"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" /> Property Tax rebate 5% active.</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8" />

      {/* ── Photo Gallery Marquee ────────────────────────── */}
      <div className="w-full bg-bg overflow-hidden relative flex justify-center">
        <div className="w-full py-4 sm:py-6 mb-4 sm:mb-8 relative overflow-hidden">
          <motion.div
            className="flex gap-3 sm:gap-4 md:gap-6 w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div key={idx} className="relative w-48 h-32 sm:w-64 sm:h-44 md:w-80 md:h-56 lg:w-[400px] lg:h-[260px] rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-md border border-border/50">
                <img src={img} alt="City Infrastructure" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            ))}
          </motion.div>
          {/* Gradient masks for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* ── Spacer ── */}
      <div className="h-4 sm:h-6" />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="w-full flex justify-center relative bg-bg overflow-hidden p-2.5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-bg to-accent-50/50 dark:from-primary-950/10 dark:via-bg dark:to-accent-950/5 -z-20" />
        <div className="hidden sm:block absolute top-4 sm:top-10 left-1/4 w-48 h-48 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-primary-300/20 rounded-full blur-[80px] sm:blur-[100px] -z-10 pointer-events-none" />
        <div className="hidden sm:block absolute bottom-4 sm:bottom-10 right-1/4 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] bg-accent-300/15 rounded-full blur-[60px] sm:blur-[80px] -z-10 pointer-events-none" />

        <div className="relative w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 pt-6 sm:pt-10 text-center flex flex-col items-center p-2.5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-8 border border-primary-200/50"
          >
            <Globe className="h-4 w-4" />
            Government Civic Services Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-fg tracking-tight leading-[1.15] mb-4 sm:mb-6 max-w-5xl"
          >
            Your City.{" "}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Your Voice.
            </span>
            <br />
            Your{" "}
            <span className="relative inline-block mt-2">
              SUVIDHA
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 7 Q50 0 100 4 Q150 8 200 1" stroke="url(#hero-gradient)" strokeWidth="4" fill="none" />
                <defs>
                  <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary-600, #4f46e5)" />
                    <stop offset="100%" stopColor="var(--accent-500, #f59e0b)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-fg-secondary leading-relaxed mb-6 sm:mb-10 px-2"
          >
              {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

            A unified platform for filing complaints, paying utility bills,
            requesting government services, and tracking resolutions — all from one place.
          </motion.p>
            {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 w-full sm:w-auto"
          >
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button 
  size="lg" 
  rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />} 
  className="!pr-4 !pl-[26px] sm:!pr-8 sm:!pl-[42px] w-full sm:w-auto shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base"
>
  Get Started Free
</Button>
            </Link>
            <Link href="/auth/login?mode=kiosk" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" leftIcon={<Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />} className="px-4 sm:px-8 w-full sm:w-auto hover:bg-primary-50 hover:border-primary-200 transition-all text-sm sm:text-base">
                Kiosk Mode
              </Button>
            </Link>
            <Link href="/complaints" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" leftIcon={<Globe className="h-4 w-4 sm:h-5 sm:w-5" />} className="px-4 sm:px-6 w-full sm:w-auto text-sm sm:text-base">
                View Public Feed
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 mt-8 sm:mt-12 text-fg-muted px-2"
          >
            {[
              { icon: <Shield className="h-3 w-3 sm:h-4 sm:w-4" />, text: "Aadhaar Verified" },
              { icon: <Bell className="h-3 w-3 sm:h-4 sm:w-4" />, text: "Real-time Alerts" },
              { icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />, text: "PWA Enabled" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium bg-surface px-2 sm:px-4 py-2 rounded-full border border-border shadow-sm">
                {badge.icon}
                <span className="hidden sm:inline">{badge.text}</span>
                <span className="sm:hidden whitespace-nowrap">{badge.text.split(" ")[0]}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── Stats ────────────────────────────────────────── */}
      <section id="stats" className="w-full flex justify-center bg-surface-muted/30 py-12 sm:py-16 md:py-20 border-y border-border/40 p-2.5">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-bg shadow-sm border border-border/40 hover:border-primary-500/30 transition-colors"
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                    {stat.value}
                  </div>
                  <p className="text-sm sm:text-base text-fg-secondary font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── Quick Services ───────────────────────────────── */}
      <section id="services" className="w-full flex justify-center py-12 sm:py-20 relative p-5">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-8 sm:mb-12 flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fg mb-3 sm:mb-4">
                Quick <span className="text-primary-600">Services</span>
                  {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

              </h2>

              <p className="max-w-2xl mx-auto text-sm sm:text-base text-fg-secondary leading-relaxed px-2">
                Access essential civic services with just one click. Select a category below to get started immediately.
              </p>
                {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickServices.map((service, i) => (
                <QuickServiceCard key={i} service={service} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="w-full flex justify-center bg-surface-muted/50 relative p-2.5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/10 to-transparent dark:via-primary-900/5 pointer-events-none -z-10" />
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
          <RevealSection>
              {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

            <div className="text-center flex flex-col items-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fg mb-3 sm:mb-4">
                Built for <span className="text-primary-600">Real Governance</span>
            
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-fg-secondary leading-relaxed px-2">
                 
                Enterprise-grade features perfectly crafted for millions of citizens and massive government infrastructure.
              </p>
                {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

            </div>
       

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
              className="group flex flex-col items-center text-center pt-8 pb-6 px-4 sm:pt-12 sm:pb-10 sm:px-6 lg:pt-16 lg:pb-12 lg:px-8 rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
>
              <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500 shadow-md text-lg sm:text-2xl`}>
    {feature.icon}
  </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-fg mb-2 sm:mb-3">
    {feature.title}
  </h3>
  <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
    {feature.description}
  </p>
             </motion.div>
            ))}
          </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── How It Works ─────────────────────────────────── */}
     {/* ── How It Works ─────────────────────────────────── */}
      <section id="how-it-works" className="w-full flex justify-center bg-bg p-2.5">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <RevealSection>
            <div className="text-center flex flex-col items-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fg mb-3 sm:mb-4">
                How It <span className="text-primary-600">Works</span>
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-fg-secondary leading-relaxed px-2">
                From registration to resolution — a seamless journey broken down into four incredibly simple steps.
              </p>
            </div>
          

          {/* Changed this div to a motion.div with your stagger variants */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative"
          >
            {/* Connector line perfectly centered behind icons */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 dark:from-primary-900/40 dark:via-primary-700/60 dark:to-primary-900/40 z-0" />

            {howItWorksSteps.map((item, i) => (
                <motion.div
                  key={i} // Added missing React key
                  variants={fadeUp} // Applied your fadeUp variant
                  custom={i} // Passes the index so they stagger one by one
                  whileHover={{ y: -4 }}
                  className="relative z-10 group flex flex-col items-center text-center bg-bg/60 backdrop-blur-sm p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-surface border-[2px] sm:border-[3px] border-primary-50 dark:border-primary-900 shadow-sm flex items-center justify-center text-primary-600 mx-auto mb-3 sm:mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:shadow-lg transition-all duration-500 text-2xl sm:text-3xl lg:text-4xl">
                    {item.icon}
                  </div>
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-xs font-bold text-primary-600 tracking-widest uppercase mb-2 sm:mb-3 text-[10px] sm:text-xs">
                    Step {item.step}
                  </span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-fg mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed px-1 sm:px-2">{item.description}</p>
                </motion.div>
            ))}
          </motion.div>
          </RevealSection>
        </div>
      </section>
      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── About ────────────────────────────────────────── */}
      <section className="w-full flex justify-center bg-surface-muted/30 p-2.5">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <RevealSection>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <div className="flex flex-col order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fg mb-4 sm:mb-6">
                  About <span className="text-primary-600">SUVIDHA</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-fg-secondary leading-relaxed mb-4 sm:mb-5">
                  SUVIDHA (Smart Urban &amp; Village Infrastructure for Digital Handling of Administration) is a
                  next-generation civic services platform designed to bridge the gap between citizens and
                  government departments.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-fg-secondary leading-relaxed mb-6 sm:mb-8">
                  Built with accessibility, transparency, and efficiency at its core, SUVIDHA empowers citizens
                  to participate in urban governance while providing administrators with powerful tools to
                  manage and resolve civic issues.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: <Globe className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Multi-language Support" },
                    { icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Aadhaar Integration" },
                    { icon: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Works Offline (PWA)" },
                    { icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Real-time Analytics" },
                  ].map((item, i) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="text-primary-600 bg-primary-50 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl flex-shrink-0">{item.icon}</div>
                      <span className="text-xs sm:text-sm font-semibold text-fg">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative flex justify-center order-1 lg:order-2">
                <motion.div
                  whileHover={{ rotate: 1, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-full max-w-xs sm:max-w-md aspect-square rounded-2xl sm:rounded-[3rem] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
                >
                  {/* Decorative background circles */}
                  <div className="hidden sm:block absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/40 dark:bg-black/10 rounded-full blur-[30px] sm:blur-[40px] translate-x-1/3 -translate-y-1/3" />
                  <div className="hidden sm:block absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-primary-200/40 dark:bg-primary-800/20 rounded-full blur-[20px] sm:blur-[30px] -translate-x-1/3 translate-y-1/3" />

                  <div className="text-center relative z-10 bg-surface/80 backdrop-blur-xl p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl w-full">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl sm:text-4xl font-extrabold mx-auto mb-3 sm:mb-6 shadow-lg shadow-primary-600/30">
                      S
                    </div>
                    <p className="text-xl sm:text-3xl font-extrabold text-fg tracking-tight mb-1 sm:mb-2">SUVIDHA</p>
                    <p className="text-xs sm:text-base text-fg-secondary font-semibold">Empowering Citizens</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="w-full flex justify-center bg-bg p-2.5">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <RevealSection>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-primary-900/20 flex flex-col items-center"
            >
              <div className="hidden sm:block absolute top-0 right-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-white/10 rounded-full blur-[60px] sm:blur-[80px] -translate-y-1/2 translate-x-1/3" />
              <div className="hidden sm:block absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-accent-400/20 rounded-full blur-[40px] sm:blur-[60px] translate-y-1/2 -translate-x-1/3" />
              <div className="relative z-10 flex flex-col items-center w-full">
                <Users className="h-8 h-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-6 opacity-90" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
                  Ready to Transform Your City?
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
                  Join thousands of citizens and administrators already using SUVIDHA to improve civic services.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Link href="/auth/register" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-primary-700 hover:bg-white/90 shadow-xl !pr-4 !pl-[26px] sm:!pr-8 sm:!pl-[42px] py-3 text-sm sm:text-base hover:-translate-y-0.5 transition-all w-full sm:w-auto"

                      rightIcon={<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                    >
                      Register as Citizen
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/40 text-white hover:bg-white/10 hover:border-white/70 !pr-4 !pl-[26px] sm:!pr-8 sm:!pl-[42px] py-3 text-sm sm:text-base hover:-translate-y-0.5 transition-all w-full sm:w-auto"
>
                      Admin Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ── Spacer ── */}
      <div className="h-6 sm:h-8 lg:h-12" />

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="w-full flex justify-center bg-surface-muted/50 pt-12 sm:pt-16 mt-auto border-t border-border/50 p-2.5">
        <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 p-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-sm">
                  S
                </div>
                <span className="font-bold text-base sm:text-xl text-fg">SUVIDHA</span>
              </div>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
                Empowering citizens through digital governance. File complaints, pay bills, and track resolutions.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-fg text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-fg-secondary">
                <li><Link href="/auth/register" className="hover:text-primary-600 transition-colors">Register</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary-600 transition-colors">Login</Link></li>
                <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a></li>
              </ul>
            </div>
            {/* Services */}
            <div>
              <h4 className="font-bold text-fg text-base sm:text-lg mb-4 sm:mb-6">Services</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-fg-secondary">
                <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Complaint Filing</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Bill Payment</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Service Requests</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Ward Mapping</span></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-fg text-base sm:text-lg mb-4 sm:mb-6">Contact</h4>
              <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm text-fg-secondary">
                <li className="flex items-center gap-2 sm:gap-3"><Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" /> <span>1800-SUVIDHA</span></li>
                <li className="flex items-center gap-2 sm:gap-3"><Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" /> <span className="break-all">help@suvidha.gov</span></li>
                <li className="flex items-center gap-2 sm:gap-3"><MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" /> <span>City Hall, Sector 1</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/60 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-fg-muted font-medium text-center sm:text-left">© 2026 SUVIDHA. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm text-fg-muted font-medium">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
