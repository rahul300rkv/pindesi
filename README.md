# PinDesi 🧡
> Pinterest automation SaaS for Indian creators — AI pin generation, auto-scheduling, INR payments, referral system.

**Live at:** `pindesi.vercel.app` after deployment

---

## Tech Stack
| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Auth | Supabase Auth (magic link — no passwords) |
| Database | Supabase Postgres (profiles, pins, referrals) |
| Pinterest | Pinterest API v5 (OAuth, post pins, fetch boards) |
| Payments | Razorpay (INR — ₹499 / ₹1499/mo) |
| Email | Resend (waitlist welcome + transactional) |
| AI | Claude API (pin content generation) |
| Cron | Vercel Cron Jobs (auto-post every 15 min) |
| Deploy | Vercel (free tier works) |

---

## Deploy in 15 Minutes

### Step 1 — Supabase (database + auth)
1. Go to [supabase.com](https://supabase.com) → New project
2. SQL Editor → New Query → paste entire contents of `supabase/schema.sql` → Run
3. Authentication → URL Configuration → add your Vercel URL to "Redirect URLs":
   `https://pindesi.vercel.app/api/auth/callback`
4. Settings → API → copy `URL`, `anon key`, `service_role key`

### Step 2 — Pinterest App
1. Go to [developers.pinterest.com](https://developers.pinterest.com) → My Apps → Add app
2. Set redirect URI: `https://pindesi.vercel.app/api/pinterest/callback`
3. Request scopes: `boards:read`, `boards:write`, `pins:read`, `pins:write`, `user_accounts:read`
4. Copy `App ID` (= CLIENT_ID) and `App secret key`

### Step 3 — Razorpay
1. [razorpay.com](https://razorpay.com) → Sign up (free, India only)
2. Settings → API Keys → Generate test key pair
3. Copy Key ID and Key Secret

### Step 4 — Resend
1. [resend.com](https://resend.com) → Sign up → API Keys → Create key
2. Free tier: 3,000 emails/month

### Step 5 — Deploy to Vercel
```bash
# Push to GitHub
git init
git add .
git commit -m "PinDesi v1 launch 🧡"
gh repo create pindesi --public --push

# Then go to vercel.com → New Project → import repo → Deploy
```

### Step 6 — Set Environment Variables in Vercel
Vercel dashboard → Settings → Environment Variables → add all vars from `.env.local.example`

Generate CRON_SECRET:
```bash
openssl rand -hex 32
```

---

## Project Structure
```
pindesi/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Magic link login
│   ├── signup/page.tsx             # Signup with referral support
│   ├── dashboard/page.tsx          # Main SaaS dashboard
│   ├── components/
│   │   ├── Nav.tsx                 # Navbar with waitlist modal
│   │   ├── Hero.tsx                # Hero with mock dashboard
│   │   ├── Ticker.tsx              # Niche ticker strip
│   │   ├── HowItWorks.tsx          # 3-step explainer
│   │   ├── Features.tsx            # Feature grid
│   │   ├── Pricing.tsx             # Chai/Biryani/Thali plans
│   │   ├── Testimonials.tsx        # Social proof
│   │   ├── CTABanner.tsx           # Bottom CTA
│   │   ├── Footer.tsx              # Footer
│   │   ├── WaitlistModal.tsx       # Email capture modal
│   │   ├── PayButton.tsx           # Razorpay checkout button
│   │   ├── ReferralPanel.tsx       # Full referral dashboard
│   │   └── ScrollReveal.tsx        # Scroll animations
│   └── api/
│       ├── auth/callback/          # Supabase auth callback + new user setup
│       ├── waitlist/               # Email capture + Resend welcome email
│       ├── create-order/           # Razorpay order creation
│       ├── pinterest/
│       │   ├── connect/            # Redirect to Pinterest OAuth
│       │   ├── callback/           # Exchange code for tokens
│       │   ├── boards/             # Fetch user's boards
│       │   └── post/               # Post a pin (with plan limit check)
│       ├── referral/               # Referral stats API
│       └── cron/
│           ├── post-scheduled/     # Auto-post due pins (every 15 min)
│           └── reset-pins/         # Reset monthly counters (1st of month)
├── lib/
│   ├── supabase.ts                 # Browser Supabase client + types
│   ├── supabase-server.ts          # Server Supabase client (SSR + admin)
│   ├── pinterest.ts                # Pinterest API v5 full integration
│   └── referral.ts                 # Referral code generation + rewards logic
├── middleware.ts                   # Route protection (auth guard)
├── supabase/schema.sql             # Complete DB schema with RLS policies
├── vercel.json                     # Cron job schedule
└── .env.local.example              # All required env vars
```

---

## Dashboard Tabs
| Tab | What it does |
|---|---|
| Pin Queue | See scheduled/live/draft pins + key stats |
| AI Generator | Claude-powered pin titles, descriptions, hashtags |
| Analytics | Impressions, saves, clicks, AI insights |
| Festival Calendar | Indian festivals with countdown + one-click content gen |
| Refer & Earn | Referral link, WhatsApp share, reward tracker |
| Settings | Pinterest connect, schedule, language, billing |
---

## Monetisation
| Plan | Price | Limits |
|---|---|---|
| Chai ☕ | Free | 10 pins/month, 1 account |
| Biryani 🍛 | ₹499/mo | Unlimited AI, 200 pins, 3 accounts, festivals |
| Thali 🍽️ | ₹1,499/mo | Everything + 10 accounts, white-label, API access |

Payments via Razorpay — INR only, no dollar billing.

---

## Referral Program
- Share your link → friend signs up → both get **1 free month**
- Max **6 referrals** = 6 free months (₹2,994 value)
- Share via WhatsApp, email, or copy link
- Tracked in `referral_rewards` table with full history

---

## Cron Jobs
| Job | Schedule | Does |
|---|---|---|
| `/api/cron/post-scheduled` | Every 15 min | Posts all pins due in the window |
| `/api/cron/reset-pins` | 1st of month, midnight | Resets `pins_used_this_month` to 0 |

Secured with `CRON_SECRET` env var.

---

## Roadmap
- [ ] Image upload (Supabase Storage) + Canva integration
- [ ] Pinterest Analytics sync (pull real impressions/saves into dashboard)
- [ ] WhatsApp notification when pin posts
- [ ] Team member invite (Thali plan)
- [ ] Mobile app (React Native)
- [ ] Affiliate program for bloggers

---

Made with 🧡 in India · [pindesi.vercel.app](https://pindesi.vercel.app)
