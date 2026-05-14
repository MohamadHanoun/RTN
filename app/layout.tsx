import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Noobs of Temple & Rift",
    template: "%s | The Noobs of Temple & Rift",
  },
  description:
    "A gaming community website for video games, tournaments, announcements, XP leaderboard, Discord stats, and future bot integration.",
  keywords: [
    "Discord",
    "Gaming",
    "Community",
    "Tournaments",
    "Leaderboard",
    "XP System",
    "Discord Bot",
    "The Noobs of Temple & Rift",
    "RTN",
  ],
  authors: [{ name: "The Noobs of Temple & Rift" }],
  creator: "The Noobs of Temple & Rift",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The Noobs of Temple & Rift",
    description:
      "A gaming community for video games, tournaments, events, XP system, leaderboard, and Discord bot integration.",
    type: "website",
    siteName: "The Noobs of Temple & Rift",
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