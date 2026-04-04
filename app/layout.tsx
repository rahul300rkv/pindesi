import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PinDesi — Pinterest Automation for Indian Creators",
  description: "Schedule pins, generate AI content for Indian trending niches, and grow your Pinterest from zero. Built for India, priced for India.",
  keywords: "Pinterest automation India, Pinterest scheduler India, desi Pinterest tool",
  openGraph: {
    title: "PinDesi — Pinterest Automation for Indian Creators",
    description: "Grow your Pinterest with AI-powered pin scheduling built for Indian niches.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
