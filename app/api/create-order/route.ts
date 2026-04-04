import { NextRequest, NextResponse } from "next/server";

// Razorpay order creation endpoint
// Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel env vars

const PLANS: Record<string, { amount: number; name: string }> = {
  biryani: { amount: 49900, name: "PinDesi Biryani Plan" },   // ₹499 in paise
  thali:   { amount: 149900, name: "PinDesi Thali Plan" },    // ₹1499 in paise
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: PLANS[plan].amount,
        currency: "INR",
        receipt: `pindesi_${plan}_${Date.now()}`,
        notes: { plan, product: "PinDesi" },
      }),
    });

    if (!razorpayRes.ok) {
      throw new Error("Razorpay order creation failed");
    }

    const order = await razorpayRes.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      planName: PLANS[plan].name,
    });
  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
