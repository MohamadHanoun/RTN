import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DISCORE Community",
    template: "%s | DISCORE Community",
  },
  description:
    "A modern Discord community website for rules, roles, tournaments, announcements, leaderboard, and future Discord bot integration.",
  keywords: [
    "Discord",
    "Community",
    "Gaming",
    "Tournaments",
    "Leaderboard",
    "XP System",
    "Discord Bot",
  ],
  authors: [{ name: "DISCORE Community" }],
  creator: "DISCORE Community",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "DISCORE Community",
    description:
      "A modern Discord community website with tournaments, XP system, leaderboard, announcements, and future bot integration.",
    type: "website",
    siteName: "DISCORE Community",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}