# PinDesi 🧡
> Pinterest automation SaaS for Indian creators — built for India, priced for India.

## Live Demo
Deploy to Vercel in 2 minutes (see below).

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind + inline CSS with CSS variables
- **Fonts**: Syne (display) + DM Sans (body) via Google Fonts
- **Payments**: Razorpay (INR, no dollar pricing)
- **Email**: Resend (waitlist + transactional)
- **AI**: Claude API (pin content generation)

## Pages
- `/` — Landing page (Nav, Hero, Ticker, How it works, Features, Pricing, Testimonials, CTA)
- `/dashboard` — Full SaaS dashboard (Pin Queue, AI Generator, Analytics, Festival Calendar, Settings)

## Deploy to Vercel (2 minutes)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "PinDesi launch"
gh repo create pindesi --public --push

# 2. Go to vercel.com → New Project → import your repo → Deploy
# Your site: pindesi.vercel.app
```

## Environment Variables (add in Vercel dashboard)
| Variable | Where to get it | Required? |
|---|---|---|
| `RESEND_API_KEY` | resend.com | For waitlist emails |
| `RAZORPAY_KEY_ID` | razorpay.com/dashboard | For payments |
| `RAZORPAY_KEY_SECRET` | razorpay.com/dashboard | For payments |

## Monetisation
- **Chai (Free)**: 10 pins/month, 15 scheduled, 1 account
- **Biryani (₹499/mo)**: Unlimited AI, 200 pins, festival calendar, Hinglish mode
- **Thali (₹1499/mo)**: Agencies, 10 accounts, white-label, Pinterest API

## Roadmap
- [ ] Supabase auth (email + Google login)
- [ ] Pinterest API v5 integration (auto-post)
- [ ] Canva template library
- [ ] Referral program (free month for each friend)
- [ ] Mobile app (React Native)

Made with 🧡 in India
