import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rtn-ebon.vercel.app"),
  title: {
    default: "Ascendra",
    template: "%s | Ascendra",
  },
  description:
    "Ascendra is a competitive gaming platform for teams, tournaments, rankings, and organized community events.",
  icons: {
    icon: "/images/brand/favicon.ico",
    shortcut: "/images/brand/favicon.ico",
    apple: "/images/brand/apple-touch-icon.png",
  },
  openGraph: {
    title: "Ascendra",
    description:
      "A competitive gaming platform for teams, tournaments, rankings, and organized community events.",
    images: [
      {
        url: "/images/brand/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Ascendra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascendra",
    description:
      "A competitive gaming platform for teams, tournaments, rankings, and organized community events.",
    images: ["/images/brand/og-cover.png"],
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
