"use client";

import { useState } from "react";
import Link from "next/link";
import { serverInfo } from "@/data/server";
import { currentContent } from "@/content/siteContent";

const navLinks = [
  { label: currentContent.nav.about, href: "/about" },
  { label: currentContent.nav.rules, href: "/rules" },
  { label: currentContent.nav.roles, href: "/roles" },
  { label: currentContent.nav.staff, href: "/staff" },
  { label: currentContent.nav.stats, href: "/stats" },
  { label: currentContent.nav.leaderboard, href: "/leaderboard" },
  { label: currentContent.nav.tournaments, href: "/tournaments" },
  { label: currentContent.nav.announcements, href: "/announcements" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          {serverInfo.shortName}
          <span className="text-indigo-400">{serverInfo.highlightedName}</span>
        </Link>

        <div className="hidden gap-8 text-sm text-gray-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href={serverInfo.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold transition hover:bg-indigo-400"
          >
            {currentContent.nav.joinDiscord}
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:hidden">
          <div className="flex flex-col gap-4 text-gray-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <a
              href={serverInfo.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-indigo-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-400"
            >
              {currentContent.nav.joinDiscord}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}