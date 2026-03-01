"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Zap,
    Droplets,
    Flame,
    Building,
    CheckCircle,
    AlertCircle,
    Clock,
    Download,
    IndianRupee,
} from "lucide-react";

import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Modal } from "@/components/ui";
import { Bill } from "@/types";
import { useAuthStore } from "@/store/auth.store";

/* ═══════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════ */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

/* ═══════════════════════════════════════════════════════════
   Style Maps
   ═══════════════════════════════════════════════════════════ */
const billIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="h-5 w-5" />,
    water: <Droplets className="h-5 w-5" />,
    gas: <Flame className="h-5 w-5" />,
    "property-tax": <Building className="h-5 w-5" />,
};

const billGradients: Record<string, string> = {
    electricity: "from-amber-500 to-orange-600",
    water: "from-blue-500 to-indigo-600",
    gas: "from-rose-500 to-red-600",
    "property-tax": "from-violet-500 to-purple-600",
};

const billShadows: Record<string, string> = {
    electricity: "shadow-amber-500/30",
    water: "shadow-blue-500/30",
    gas: "shadow-rose-500/30",
    "property-tax": "shadow-violet-500/30",
};

const statusBadgeStyles: Record<string, string> = {
    overdue: "bg-rose-50 text-rose-700 border-rose-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    unpaid: "bg-amber-50 text-amber-700 border-amber-200",
};

const statusBadgeIcons: Record<string, React.ReactNode> = {
    overdue: <AlertCircle className="h-3 w-3" />,
    paid: <CheckCircle className="h-3 w-3" />,
    unpaid: <Clock className="h-3 w-3" />,
};

const statusBadgeLabels: Record<string, string> = {
    overdue: "Overdue",
    paid: "Paid",
    unpaid: "Due",
};

/* ---------------- RAZORPAY LOADER ---------------- */
const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */
export default function BillsPage() {
    const { token } = useAuthStore();

    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentModal, setPaymentModal] = useState<Bill | null>(null);
    const [paying, setPaying] = useState(false);
    const [tab, setTab] = useState<"unpaid" | "paid">("unpaid");

    /* ---------------- PAYMENT HANDLER ---------------- */
    const handlePay = async (bill: Bill) => {
        try {
            if (!token) {
                alert("Authentication required");
                return;
            }

            setPaying(true);

            // 1️⃣ Create Order
            const orderRes = await fetch(
                "https://suvidha-qxz1.onrender.com/api/payments/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: bill.amount,
                        service_type: bill.type,
                        bill_id: bill.id,
                    }),
                }
            );

            const orderData = await orderRes.json();
            if (!orderData.success) {
                alert("Failed to create payment order");
                return;
            }

            const razorpayLoaded = await loadRazorpay();
            if (!razorpayLoaded) {
                alert("Failed to load Razorpay");
                return;
            }

            // 2️⃣ Razorpay Options
            const options = {
                key: orderData.key_id,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Suvidha Portal",
                description: `${bill.type} Bill Payment`,
                order_id: orderData.order.id,

                handler: async function (response: any) {
                    // 3️⃣ Verify Payment
                    const verifyRes = await fetch(
                        "https://suvidha-qxz1.onrender.com/api/payments/verify",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(response),
                        }
                    );

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        setBills((prev) =>
                            prev.map((b) =>
                                b.id === bill.id ? { ...b, status: "paid" as const } : b
                            )
                        );
                        alert("Payment successful!");
                    } else {
                        alert("Payment verification failed");
                    }
                },

                theme: { color: "#6366F1" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            setPaymentModal(null);
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed");
        } finally {
            setPaying(false);
        }
    };

    /* ---------------- DERIVED VALUES ---------------- */
    const unpaidBills = bills.filter((b) => b.status !== "paid");
    const paidBills = bills.filter((b) => b.status === "paid");
    const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
    const displayBills = tab === "unpaid" ? unpaidBills : paidBills;

    /* ---------------- UI ---------------- */
    return (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 overflow-hidden">
            {/* ── Decorative Background Blobs ── */}
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary-300/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-accent-300/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* ── Header ── */}
            <motion.div variants={cardAnim} custom={0}>
                <h1 className="text-2xl sm:text-3xl font-bold text-fg">
                    Bill <span className="text-primary-600">Payments</span>
                </h1>
                <p className="text-fg-secondary mt-1 text-sm">Manage and pay your utility bills in one place.</p>
            </motion.div>

            {/* ── Total Due Banner ── */}
            <motion.div variants={cardAnim} custom={1} whileHover={{ y: -4, scale: 1.01 }}>
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white border-0 shadow-xl shadow-primary-900/20 p-6 sm:p-8">
                    {/* Inner decorative glows */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-accent-400/15 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/70 font-medium uppercase tracking-wider">Total Amount Due</p>
                            <p className="text-4xl sm:text-5xl font-extrabold mt-2">₹{totalDue.toLocaleString()}</p>
                            <p className="text-sm text-white/60 mt-2 font-medium">{unpaidBills.length} pending bill{unpaidBills.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 shadow-inner flex items-center justify-center">
                            <IndianRupee className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Tabs ── */}
            <motion.div variants={cardAnim} custom={2}>
                <div className="flex gap-1 p-1.5 bg-surface-muted/50 rounded-2xl border border-border/40 w-fit">
                    <button
                        onClick={() => setTab("unpaid")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${tab === "unpaid"
                            ? "bg-surface shadow-sm text-fg"
                            : "text-fg-secondary hover:text-fg"
                            }`}
                    >
                        Unpaid
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === "unpaid"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-surface-muted text-fg-muted"
                            }`}>
                            {unpaidBills.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setTab("paid")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${tab === "paid"
                            ? "bg-surface shadow-sm text-fg"
                            : "text-fg-secondary hover:text-fg"
                            }`}
                    >
                        Paid
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-surface-muted text-fg-muted"
                            }`}>
                            {paidBills.length}
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* ── Bill Cards ── */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                {displayBills.map((bill, i) => (
                    <motion.div
                        key={bill.id}
                        variants={cardAnim}
                        custom={i}
                        whileHover={{ y: -2 }}
                    >
                        <div className="group rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 p-5 sm:p-6">
                            <div className="flex items-center gap-4">
                                {/* Bill Type Icon */}
                                <div
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${billGradients[bill.type] || "from-primary-500 to-primary-600"} flex items-center justify-center text-white shrink-0 shadow-md ${billShadows[bill.type] || "shadow-primary-500/30"} group-hover:scale-110 group-hover:rotate-[-4deg] transition-transform duration-500`}
                                >
                                    {billIcons[bill.type]}
                                </div>

                                {/* Bill Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-sm sm:text-base font-bold text-fg capitalize">{bill.type.replace("-", " ")} Bill</h3>
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${statusBadgeStyles[bill.status] || "bg-surface-muted text-fg-secondary border-border"}`}>
                                            {statusBadgeIcons[bill.status]}
                                            {statusBadgeLabels[bill.status] || bill.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-fg-muted font-medium">
                                        <span>{bill.period}</span>
                                        <span className="text-border">•</span>
                                        <span>A/C: {bill.accountNumber}</span>
                                        <span className="text-border">•</span>
                                        <span>Due: {bill.dueDate}</span>
                                    </div>
                                </div>

                                {/* Amount & Action */}
                                <div className="text-right shrink-0">
                                    <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                        ₹{bill.amount.toLocaleString()}
                                    </p>
                                    {bill.status !== "paid" ? (
                                        <Button size="sm" className="mt-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => setPaymentModal(bill)}>
                                            Pay Now
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="mt-2 hover:bg-primary-50 hover:text-primary-600 transition-all" leftIcon={<Download className="h-3 w-3" />}>
                                            Receipt
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State */}
                {displayBills.length === 0 && (
                    <motion.div variants={cardAnim} custom={0}>
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                                <CreditCard className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-semibold text-fg mb-1">
                                {tab === "unpaid" ? "All caught up!" : "No paid bills yet"}
                            </p>
                            <p className="text-sm text-fg-secondary max-w-xs">
                                {tab === "unpaid"
                                    ? "You have no pending bills. New bills will appear here when generated."
                                    : "Your payment history will appear here once you make your first payment."
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* ── Payment Modal ── */}
            <Modal
                open={!!paymentModal}
                onClose={() => setPaymentModal(null)}
                title="Confirm Payment"
                size="sm"
            >
                {paymentModal && (
                    <div className="space-y-5">
                        {/* Amount Card */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                            <p className="text-sm text-white/70 font-medium relative z-10">Amount to Pay</p>
                            <p className="text-3xl sm:text-4xl font-extrabold mt-1 relative z-10">₹{paymentModal.amount.toLocaleString()}</p>
                        </div>

                        {/* Bill Details */}
                        <div className="rounded-2xl bg-surface-muted/50 border border-border/40 p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-fg-secondary font-medium">Service</span>
                                <span className="text-fg font-semibold capitalize">{paymentModal.type.replace("-", " ")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-fg-secondary font-medium">Account</span>
                                <span className="text-fg font-semibold">{paymentModal.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-fg-secondary font-medium">Period</span>
                                <span className="text-fg font-semibold">{paymentModal.period}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-fg-secondary font-medium">Due Date</span>
                                <span className="text-fg font-semibold">{paymentModal.dueDate}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-border/60 pt-4 flex gap-3">
                            <Button variant="outline" className="flex-1 hover:bg-surface-muted transition-all" onClick={() => setPaymentModal(null)}>Cancel</Button>
                            <Button className="flex-1 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" isLoading={paying} onClick={() => handlePay(paymentModal)}>
                                Confirm Payment
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}
