import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RuleCard from "@/components/RuleCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Rules | Ascendra",
  description: "Ascendra community rules.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getRules() {
  return prisma.rule.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export default async function RulesPage() {
  const rules = await getRules();

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16)_0%,transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#090b15_42%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative min-h-[430px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/backgrounds/community-hero.webp")',
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,17,0.90)_0%,rgba(7,8,17,0.62)_44%,rgba(7,8,17,0.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#070811]/75 to-[#070811]" />

          <div className="relative z-10 mx-auto max-w-[1680px] px-6 pb-28 pt-20 lg:px-10 2xl:px-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Community
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              Rules
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
              Guidelines for Ascendra players and teams.
            </p>
          </div>
        </section>

        <section className="relative -mt-16 mx-auto grid max-w-[1680px] gap-8 px-6 pb-16 lg:px-10 2xl:px-14">
          {rules.length === 0 ? (
            <EmptyState
              title="No active rules yet"
              description="Rules will appear here when they are published."
            />
          ) : (
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur">
              <div className="hidden bg-white/[0.03] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 md:grid md:grid-cols-[90px_minmax(0,1fr)]">
                <span>No.</span>
                <span>Rule</span>
              </div>

              <div className="divide-y divide-white/10">
                {rules.map((rule, index) => (
                  <RuleCard key={rule.id} rule={rule.text} index={index} />
                ))}
              </div>
            </section>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
