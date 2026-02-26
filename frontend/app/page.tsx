"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
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
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  { icon: <Zap className="h-5 w-5" />, label: "Electricity", color: "#F59E0B", href: "/citizen/services/electricity" },
  { icon: <Droplets className="h-5 w-5" />, label: "Water Supply", color: "#3B82F6", href: "/citizen/services/water" },
  { icon: <Route className="h-5 w-5" />, label: "Roads", color: "#8B5CF6", href: "/citizen/services/roads" },
  { icon: <Recycle className="h-5 w-5" />, label: "Sanitation", color: "#10B981", href: "/citizen/services/sanitation" },
];

const howItWorksSteps = [
  { step: "01", title: "Register & Verify", description: "Create your account and verify with Aadhaar for instant access.", icon: <Users className="h-7 w-7" /> },
  { step: "02", title: "File a Complaint", description: "Describe the issue, tag the location on the map, and submit with photos.", icon: <FileText className="h-7 w-7" /> },
  { step: "03", title: "Track in Real-Time", description: "Get live updates as your complaint moves through departments.", icon: <Clock className="h-7 w-7" /> },
  { step: "04", title: "Resolution", description: "Receive notification when resolved. Rate the service quality.", icon: <Star className="h-7 w-7" /> },
];

const stats = [
  { value: "50K+", label: "Citizens Served" },
  { value: "12K+", label: "Complaints Resolved" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4", label: "Departments" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506905925200-84384a8dd1bd?auto=format&fit=crop&w=400&q=80",
];

/* ═══════════════════════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════════
   Scroll Reveal Wrapper
   ═══════════════════════════════════════════════════════════ */
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar shrinking on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg selection:bg-primary-500/30">

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled
            ? "bg-bg/90 backdrop-blur-lg shadow-sm py-2"
            : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold shadow-sm transition-all duration-500 ${scrolled ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg group-hover:scale-105'}`}>
              S
            </div>
            <span className={`font-bold text-fg tracking-tight transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'}`}>SUVIDHA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-fg-secondary">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-primary-600 transition-colors">Impact</a>
            <a href="#services" className="hover:text-primary-600 transition-colors">Services</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size={scrolled ? "sm" : "md"} className="transition-all">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size={scrolled ? "sm" : "md"} rightIcon={<ArrowRight className="h-4 w-4" />} className="transition-all shadow-md hover:shadow-lg">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacing to account for fixed navbar */}
      <div className="h-20"></div>

      {/* ── Live Notification Ticker ─────────────────────── */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white overflow-hidden py-2 shadow-inner">
        <motion.div
          className="flex whitespace-nowrap items-center text-sm font-medium"
          animate={{ x: [0, -1035] }} // Adjust based on content width
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <span className="flex items-center mx-8"><AlertCircle className="h-4 w-4 mr-2" /> Live Update: Scheduled water maintenance in Ward 4 tomorrow from 10 AM - 2 PM.</span>
          <span className="flex items-center mx-8"><CheckCircle className="h-4 w-4 mr-2" /> New Property Tax rebate of 5% active until month end.</span>
          <span className="flex items-center mx-8"><AlertCircle className="h-4 w-4 mr-2" /> Live Update: Scheduled water maintenance in Ward 4 tomorrow from 10 AM - 2 PM.</span>
          <span className="flex items-center mx-8"><CheckCircle className="h-4 w-4 mr-2" /> New Property Tax rebate of 5% active until month end.</span>
        </motion.div>
      </div>

      {/* ── Photo Gallery Marquee ────────────────────────── */}
      <div className="w-full overflow-hidden bg-bg py-4 opacity-80 hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -2400] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {[...galleryImages, ...galleryImages].map((img, idx) => (
            <div key={idx} className="min-w-[280px] h-40 sm:h-48 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
              <img src={img} alt="City Infrastructure" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 sm:pb-32 pt-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-bg to-accent-50/50 dark:from-primary-950/10 dark:via-bg dark:to-accent-950/5" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent-300/15 rounded-full blur-[80px] -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 shadow-sm"
          >
            <Globe className="h-4 w-4" />
            Government Civic Services Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-fg tracking-tight leading-[1.1] mb-6"
          >
            Your City.{" "}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Your Voice.
            </span>
            <br />
            Your{" "}
            <span className="relative inline-block">
              SUVIDHA
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 7 Q50 0 100 4 Q150 8 200 1" stroke="url(#hero-gradient)" strokeWidth="3" fill="none" />
                <defs>
                  <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-fg-secondary leading-relaxed mb-10"
          >
            A unified platform for filing complaints, paying utility bills,
            requesting government services, and tracking resolutions — all from one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />} className="shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all hover:-translate-y-1">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login?mode=kiosk">
              <Button variant="outline" size="xl" leftIcon={<Smartphone className="h-5 w-5" />} className="hover:bg-primary-50 hover:border-primary-200 transition-all hover:-translate-y-1">
                Kiosk Mode
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-fg-muted"
          >
            {[
              { icon: <Shield className="h-4 w-4" />, text: "Aadhaar Verified" },
              { icon: <Bell className="h-4 w-4" />, text: "Real-time Alerts" },
              { icon: <CheckCircle className="h-4 w-4" />, text: "PWA Enabled" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm bg-surface-muted px-3 py-1.5 rounded-full border border-border/50">
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section id="stats" className="bg-surface/50 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-bg shadow-sm border border-border/40"
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-sm text-fg-secondary mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Quick Services ───────────────────────────────── */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-4">
              Quick <span className="text-primary-600">Services</span>
            </h2>
            <p className="max-w-lg mx-auto text-fg-secondary">
              Access essential civic services with just one click.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {quickServices.map((service, i) => (
              <Link key={i} href={service.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-surface border border-border/50 hover:border-transparent hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: service.color, boxShadow: `0 10px 25px -5px ${service.color}60` }}
                  >
                    {service.icon}
                  </div>
                  <span className="text-base font-semibold text-fg">{service.label}</span>
                  <div className="flex items-center text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    Access Service <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="bg-surface-muted/50 py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/20 to-transparent dark:via-primary-900/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-4">
                Built for <span className="text-primary-600">Real Governance</span>
              </h2>
              <p className="max-w-lg mx-auto text-fg-secondary">
                Enterprise-grade features designed for millions of citizens and government administrators.
              </p>
            </div>
          </RevealSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-3xl bg-surface border border-border/50 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-fg mb-3">{feature.title}</h3>
                <p className="text-base text-fg-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <RevealSection>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-4">
              How It <span className="text-primary-600">Works</span>
            </h2>
            <p className="max-w-lg mx-auto text-fg-secondary">
              From registration to resolution — a seamless journey in four simple steps.
            </p>
          </div>
        </RevealSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line behind items */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 dark:from-primary-900/30 dark:via-primary-700/50 dark:to-primary-900/30 z-0" />

          {howItWorksSteps.map((item, i) => (
            <RevealSection key={i}>
              <motion.div
                whileHover={{ y: -10 }}
                className="relative z-10 group text-center bg-bg/50 backdrop-blur-sm p-4 rounded-3xl transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-3xl bg-surface border-2 border-primary-100 dark:border-primary-900 shadow-sm flex items-center justify-center text-primary-600 mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500">
                  {item.icon}
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-xs font-bold text-primary-600 tracking-widest uppercase mb-3">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold text-fg mb-3">{item.title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed px-2">{item.description}</p>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section className="bg-surface-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <RevealSection>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-6">
                  About <span className="text-primary-600">SUVIDHA</span>
                </h2>
                <p className="text-lg text-fg-secondary leading-relaxed mb-4">
                  SUVIDHA (Smart Urban & Village Infrastructure for Digital Handling of Administration) is a
                  next-generation civic services platform designed to bridge the gap between citizens and
                  government departments.
                </p>
                <p className="text-lg text-fg-secondary leading-relaxed mb-8">
                  Built with accessibility, transparency, and efficiency at its core, SUVIDHA empowers citizens
                  to participate in urban governance while providing administrators with powerful tools to
                  manage and resolve civic issues.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Globe className="h-5 w-5" />, text: "Multi-language Support" },
                    { icon: <Shield className="h-5 w-5" />, text: "Aadhaar Integration" },
                    { icon: <Smartphone className="h-5 w-5" />, text: "Works Offline (PWA)" },
                    { icon: <BarChart3 className="h-5 w-5" />, text: "Real-time Analytics" },
                  ].map((item, i) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border/50 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="text-primary-600 bg-primary-50 p-2 rounded-lg">{item.icon}</div>
                      <span className="text-sm font-semibold text-fg">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 2, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 flex items-center justify-center p-8 relative overflow-hidden"
                >
                  {/* Decorative background circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-black/10 rounded-full blur-[40px] translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-200/40 dark:bg-primary-800/20 rounded-full blur-[30px] -translate-x-1/3 translate-y-1/3" />

                  <div className="text-center relative z-10 bg-surface/60 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-xl">
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-6 shadow-2xl shadow-primary-600/30">
                      S
                    </div>
                    <p className="text-3xl font-extrabold text-fg tracking-tight">SUVIDHA</p>
                    <p className="text-base text-fg-secondary mt-2 font-medium">Empowering Citizens</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-10 sm:p-20 text-center text-white shadow-2xl shadow-primary-900/20"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />
            <div className="relative z-10">
              <Users className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                Ready to Transform Your City?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of citizens and administrators already using SUVIDHA to improve civic services.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/auth/register">
                  <Button
                    variant="secondary"
                    size="xl"
                    className="bg-white text-primary-700 hover:bg-white/90 shadow-xl hover:-translate-y-1 transition-all"
                    rightIcon={<ChevronRight className="h-5 w-5" />}
                  >
                    Register as Citizen
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 hover:-translate-y-1 transition-all"
                  >
                    Admin Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </RevealSection>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-surface-muted/50 pt-16 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  S
                </div>
                <span className="font-bold text-xl text-fg">SUVIDHA</span>
              </div>
              <p className="text-base text-fg-secondary leading-relaxed">
                Empowering citizens through digital governance. File complaints, pay bills, and track resolutions.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-fg text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-base text-fg-secondary">
                <li><Link href="/auth/register" className="hover:text-primary-600 transition-colors">Register</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary-600 transition-colors">Login</Link></li>
                <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a></li>
              </ul>
            </div>
            {/* Services */}
            <div>
              <h4 className="font-semibold text-fg text-lg mb-6">Services</h4>
              <ul className="space-y-3 text-base text-fg-secondary">
                <li><span className="hover:text-primary-600 transition-colors cursor-default">Complaint Filing</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-default">Bill Payment</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-default">Service Requests</span></li>
                <li><span className="hover:text-primary-600 transition-colors cursor-default">Ward Mapping</span></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-fg text-lg mb-6">Contact</h4>
              <ul className="space-y-4 text-base text-fg-secondary">
                <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary-500" /> 1800-SUVIDHA</li>
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary-500" /> help@suvidha.gov</li>
                <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary-500" /> City Hall, Sector 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-fg-muted font-medium">© 2026 SUVIDHA. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm text-fg-muted font-medium">
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