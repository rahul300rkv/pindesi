"use client";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface PayButtonProps {
  plan: "biryani" | "thali";
  label: string;
  style?: React.CSSProperties;
}

export default function PayButton({ plan, label, style }: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      // Load Razorpay SDK dynamically
      await new Promise<void>((resolve, reject) => {
        if (window.Razorpay) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
        document.head.appendChild(script);
      });

      // Create order on server
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const order = await res.json();

      if (order.error) {
        alert("Payment setup not ready yet — check back soon!");
        return;
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "PinDesi",
        description: order.planName,
        order_id: order.orderId,
        theme: { color: "#FF6B00" },
        prefill: { contact: "", email: "" },
        handler: function (response: Record<string, string>) {
          // In production: verify payment signature on your server
          console.log("Payment success:", response);
          window.location.href = `/dashboard?welcome=true&plan=${plan}`;
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handlePay} disabled={loading} style={style}>
      {loading ? "Loading..." : label}
    </button>
  );
}
