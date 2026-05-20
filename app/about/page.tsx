import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Ascendra",
  description: "Learn more about Ascendra.",
};

const values = [
  {
    title: "Teams",
    description: "Create teams, invite players, and prepare for events.",
  },
  {
    title: "Tournaments",
    description: "Join community events and follow tournament progress.",
  },
  {
    title: "Results",
    description: "Track placements, points, and leaderboard progress.",
  },
  {
    title: "Community",
    description: "Keep competition organized, fair, and easy to follow.",
  },
];

function ValueRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="grid gap-3 p-5 transition hover:bg-white/[0.035] md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
      <h3 className="text-xl font-black text-white">{title}</h3>

      <p className="text-sm leading-6 text-gray-400">{description}</p>
    </article>
  );
}

export default function AboutPage() {
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
              Platform
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              About
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
              Ascendra is a community platform for teams, tournaments, and
              competitive progress.
            </p>
          </div>
        </section>

        <section className="relative -mt-16 mx-auto grid max-w-[1680px] gap-8 px-6 pb-16 lg:px-10 2xl:px-14">
          <section className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                Purpose
              </p>

              <h2 className="mb-5 text-3xl font-black text-white">
                Organized competitive play.
              </h2>

              <div className="grid gap-5 leading-8 text-gray-300">
                <p>
                  Ascendra helps players create teams, join tournaments, follow
                  results, and build a more organized competitive community.
                </p>

                <p>
                  The platform is designed to stay simple: players manage teams
                  and registrations, while admins manage events, approvals, and
                  results.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-violet-400/25 bg-violet-500/10 p-8 shadow-2xl shadow-violet-950/20 backdrop-blur">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                Motto
              </p>

              <h2 className="text-4xl font-black uppercase leading-tight text-white">
                Rise Beyond Limits
              </h2>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur">
            <div className="hidden bg-white/[0.03] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 md:grid md:grid-cols-[220px_minmax(0,1fr)]">
              <span>Area</span>
              <span>Description</span>
            </div>

            <div className="divide-y divide-white/10">
              {values.map((item) => (
                <ValueRow
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </section>
        </section>

        <Footer />
      </div>
    </main>
  );
}
