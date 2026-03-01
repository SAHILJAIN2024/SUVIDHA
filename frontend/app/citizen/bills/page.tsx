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

const billIcons: Record<string, React.ReactNode> = {
  electricity: <Zap className="h-5 w-5" />,
  water: <Droplets className="h-5 w-5" />,
  gas: <Flame className="h-5 w-5" />,
  "property-tax": <Building className="h-5 w-5" />,
};

const billColors: Record<string, string> = {
  electricity: "#F59E0B",
  water: "#3B82F6",
  gas: "#EF4444",
  "property-tax": "#8B5CF6",
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">Bill Payments</h1>

      {/* Total Due Banner */}
      <Card
        variant="glass"
        className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0"
      >
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Total Amount Due</p>
              <p className="text-4xl font-bold mt-1">
                ₹{totalDue.toLocaleString()}
              </p>
              <p className="text-sm text-white/60 mt-1">
                {unpaidBills.length} pending bills
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <IndianRupee className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-muted rounded-xl w-fit">
        <button
          onClick={() => setTab("unpaid")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "unpaid"
              ? "bg-surface shadow-sm text-fg"
              : "text-fg-secondary hover:text-fg"
          }`}
        >
          Unpaid ({unpaidBills.length})
        </button>
        <button
          onClick={() => setTab("paid")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "paid"
              ? "bg-surface shadow-sm text-fg"
              : "text-fg-secondary hover:text-fg"
          }`}
        >
          Paid ({paidBills.length})
        </button>
      </div>

      {/* Bill Cards */}
      <div className="space-y-3">
        {displayBills.map((bill, i) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: billColors[bill.type] }}
                  >
                    {billIcons[bill.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-fg capitalize">
                        {bill.type.replace("-", " ")} Bill
                      </h3>

                      {bill.status === "paid" && (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="h-3 w-3" /> Paid
                        </Badge>
                      )}
                      {bill.status === "unpaid" && (
                        <Badge variant="warning" size="sm">
                          <Clock className="h-3 w-3" /> Due
                        </Badge>
                      )}
                      {bill.status === "overdue" && (
                        <Badge variant="danger" size="sm">
                          <AlertCircle className="h-3 w-3" /> Overdue
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-fg-muted">
                      <span>{bill.period}</span>
                      <span>•</span>
                      <span>A/C: {bill.accountNumber}</span>
                      <span>•</span>
                      <span>Due: {bill.dueDate}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-fg">
                      ₹{bill.amount.toLocaleString()}
                    </p>

                    {bill.status !== "paid" ? (
                      <Button
                        size="sm"
                        className="mt-1"
                        onClick={() => setPaymentModal(bill)}
                      >
                        Pay Now
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        leftIcon={<Download className="h-3 w-3" />}
                      >
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      <Modal
        open={!!paymentModal}
        onClose={() => setPaymentModal(null)}
        title="Confirm Payment"
        size="sm"
      >
        {paymentModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-muted text-center">
              <p className="text-sm text-fg-secondary">Amount</p>
              <p className="text-3xl font-bold text-fg mt-1">
                ₹{paymentModal.amount.toLocaleString()}
              </p>
            </div>

            <div className="border-t border-border pt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPaymentModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                isLoading={paying}
                onClick={() => handlePay(paymentModal)}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}