import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Ascendra",
  description: "Learn more about the Ascendra competitive gaming community.",
};

const values = [
  {
    title: "Community first",
    description:
      "Ascendra is built around respect, teamwork, and a welcoming space for players of different games and skill levels.",
  },
  {
    title: "Competitive events",
    description:
      "The platform focuses on tournaments, teams, rankings, and structured competitive moments.",
  },
  {
    title: "Fair play",
    description:
      "Good behavior, fair competition, and respect for other members are core parts of the Ascendra experience.",
  },
  {
    title: "Rise together",
    description:
      "Ascendra is made for players who want to meet others, improve, compete, and grow as a community.",
  },
];

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <h3 className="mb-3 text-xl font-black text-white">{title}</h3>

      <p className="leading-7 text-gray-400">{description}</p>
    </article>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,8,17,0.98),rgba(7,8,17,0.82),rgba(7,8,17,0.98)),url('https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.28)_0%,transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10)_0%,transparent_28%)]" />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
              About Ascendra
            </p>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
              A competitive home for players and teams.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Ascendra is a gaming community and tournament platform for players
              who enjoy teamwork, competition, events, rankings, and building
              something together.
            </p>
          </div>

          <svg
            className="absolute bottom-[-1px] left-0 w-full text-[#070811]"
            viewBox="0 0 1440 120"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/20">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                Who we are
              </p>

              <h2 className="mb-5 text-3xl font-black text-white">
                Built for organized competitive play.
              </h2>

              <div className="grid gap-5 leading-8 text-gray-300">
                <p>
                  Ascendra is made for players who want more than random
                  matches. It is a place where members can create teams, join
                  tournaments, earn points, follow rankings, and take part in a
                  focused competitive community.
                </p>

                <p>
                  The platform welcomes both casual players and competitive
                  players. The goal is to keep the experience clear, fair, and
                  enjoyable while giving teams a structured place to compete.
                </p>

                <p>
                  Ascendra is designed to grow step by step: tournaments first,
                  then realtime updates, Discord bot integration, brackets, and
                  deeper competitive systems.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-violet-400/25 bg-violet-500/10 p-8 shadow-2xl shadow-violet-950/20">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                What Ascendra offers
              </p>

              <h2 className="mb-5 text-3xl font-black text-white">
                RISE BEYOND LIMITS
              </h2>

              <ul className="grid gap-4 text-gray-300">
                <li>Team creation and member invitations</li>
                <li>Community tournaments and registrations</li>
                <li>Leaderboard and tournament points</li>
                <li>Rules that keep competition fair</li>
                <li>Staff and admin tools for smooth management</li>
                <li>Future Discord bot and bracket system</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <ValueCard
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
