import { NextRequest, NextResponse } from "next/server";

// Waitlist API — stores emails and sends welcome email via Resend
// Replace RESEND_API_KEY in your Vercel env vars

export async function POST(req: NextRequest) {
  try {
    const { email, name, niche } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send welcome email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PinDesi <hello@pindesi.in>",
          to: [email],
          subject: "🧡 You're on the PinDesi waitlist!",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #FFFAF6;">
              <div style="font-size: 24px; font-weight: 800; color: #1A0A00; margin-bottom: 4px;">
                Pin<span style="color: #FF6B00;">Desi</span>
              </div>
              <div style="font-size: 12px; color: #7A5C4A; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 0.08em;">Pinterest Automation for Indian Creators</div>

              <h1 style="font-size: 26px; font-weight: 800; color: #1A0A00; margin-bottom: 12px; line-height: 1.2;">
                You're in, ${name || "creator"}! 🎉
              </h1>
              <p style="font-size: 15px; color: #7A5C4A; line-height: 1.7; margin-bottom: 24px;">
                You're on the PinDesi early access list. We'll email you the moment your account is ready — and early members get <strong style="color: #FF6B00;">3 months of Biryani plan free</strong>.
              </p>

              <div style="background: #FFF3E8; border-radius: 10px; padding: 20px; margin-bottom: 28px; border-left: 4px solid #FF6B00;">
                <div style="font-size: 13px; font-weight: 700; color: #FF6B00; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">What to do while you wait</div>
                <ul style="font-size: 14px; color: #2D1200; line-height: 1.8; padding-left: 16px;">
                  <li>Create a Pinterest Business account (free)</li>
                  <li>Pick 1 niche: ${niche || "home decor, recipes, fashion"}</li>
                  <li>Create 3-5 boards with keyword-rich names</li>
                  <li>Follow us on Instagram @pindesi.in</li>
                </ul>
              </div>

              <p style="font-size: 13px; color: #7A5C4A; line-height: 1.6;">
                Made with 🧡 in India · <a href="https://pindesi.vercel.app" style="color: #FF6B00;">pindesi.vercel.app</a>
              </p>
            </div>
          `,
        }),
      });
    }

    // In production: save to your DB (Supabase, PlanetScale, etc.)
    // await db.insert({ email, name, niche, created_at: new Date() })
    
    console.log(`New waitlist signup: ${email} | niche: ${niche}`);

    return NextResponse.json({ success: true, message: "You're on the list!" });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
