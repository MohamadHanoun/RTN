import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ascendra Design Preview",
  description: "Ascendra homepage visual direction preview.",
};

const tournaments = [
  {
    id: "1",
    title: "Ascendra Cup #7",
    game: "Valorant",
    date: "20/06/2026",
    teamSize: "5v5",
    teams: "8/32",
    status: "Open",
    registrationStatus: "Registration Open",
  },
  {
    id: "2",
    title: "Counter-Strike League",
    game: "CS2",
    date: "24/06/2026",
    teamSize: "5v5",
    teams: "4/16",
    status: "Upcoming",
    registrationStatus: "Registration Open",
  },
  {
    id: "3",
    title: "Ascendra Clash",
    game: "Dota 2",
    date: "01/07/2026",
    teamSize: "5v5",
    teams: "12/24",
    status: "Open",
    registrationStatus: "Registration Open",
  },
];

const features = [
  {
    title: "Create teams",
    description:
      "Players create teams, invite members, and prepare their squad for tournament registration.",
  },
  {
    title: "Join tournaments",
    description:
      "Approved teams can register for open tournaments that match their game and team size.",
  },
  {
    title: "Admin review",
    description:
      "Admins review registrations, approve teams, award points, and keep tournaments organized.",
  },
];

const profileItems = [
  ["Discord status", "Connected"],
  ["Team invitations", "Realtime ready"],
  ["My teams", "Compact list"],
  ["Tournament points", "Visible progress"],
];

function StatusBadge({
  status,
  variant = "default",
}: {
  status: string;
  variant?: "default" | "success" | "warning" | "live";
}) {
  const styles = {
    default: "border-violet-400/25 bg-violet-500/10 text-violet-200",
    success: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    warning: "border-yellow-400/25 bg-yellow-500/10 text-yellow-300",
    live: "border-red-400/25 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${styles[variant]}`}
    >
      {status}
    </span>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition hover:border-violet-400/30 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-violet-300">
        {label}
      </p>

      <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-8 text-gray-400 md:text-lg">
        {description}
      </p>
    </div>
  );
}

function AscendraLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center">
        <div className="absolute inset-0 rounded-xl bg-violet-500 opacity-40 blur-xl" />
        <div className="relative h-8 w-8 rotate-45 border-l-4 border-t-4 border-violet-400" />
      </div>

      <div>
        <p className="text-xl font-black uppercase tracking-[0.18em] text-white">
          Ascendra
        </p>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-300">
          Rise beyond
        </p>
      </div>
    </Link>
  );
}

function TournamentOverviewCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#11121d]/85 p-4 shadow-2xl shadow-violet-950/25 backdrop-blur">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080912]">
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-300">
            Upcoming tournaments
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Tournament overview
          </h2>
        </div>

        <div className="divide-y divide-white/10">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-black text-white">
                  {tournament.title}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  {tournament.game} · {tournament.teamSize} · {tournament.teams}{" "}
                  teams
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <StatusBadge
                  status={tournament.status}
                  variant={tournament.status === "Open" ? "success" : "warning"}
                />
                <StatusBadge status={tournament.registrationStatus} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 text-lg font-black text-white shadow-lg shadow-violet-950/30">
        {index}
      </div>

      <h3 className="text-2xl font-black text-white">{title}</h3>

      <p className="mt-4 leading-7 text-gray-400">{description}</p>
    </article>
  );
}

function TournamentRow({
  tournament,
}: {
  tournament: (typeof tournaments)[number];
}) {
  return (
    <div className="grid gap-4 border-b border-white/10 px-5 py-5 last:border-b-0 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr_auto] lg:items-center">
      <div>
        <p className="font-black text-white">{tournament.title}</p>
        <p className="mt-1 text-sm text-gray-500">{tournament.date}</p>
      </div>

      <p className="text-sm font-bold text-violet-300">{tournament.game}</p>

      <p className="font-bold text-white">{tournament.teamSize}</p>

      <p className="font-bold text-white">{tournament.teams}</p>

      <StatusBadge
        status={tournament.status}
        variant={tournament.status === "Open" ? "success" : "warning"}
      />

      <Link
        href="/tournaments"
        className="rounded-xl bg-violet-600 px-4 py-2 text-center text-sm font-black text-white transition hover:bg-violet-500"
      >
        Details
      </Link>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-300">
          Profile structure
        </p>

        <h3 className="mt-2 text-2xl font-black text-white">
          What should be visible first
        </h3>
      </div>

      <div className="divide-y divide-white/10">
        {profileItems.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-5 px-6 py-5"
          >
            <span className="font-bold text-white">{label}</span>
            <span className="text-right text-sm font-black text-violet-300">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignPreviewPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <header className="relative z-20 border-b border-white/10 bg-[#070811]/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-5 lg:px-10 2xl:px-16">
          <AscendraLogo />

          <nav className="hidden items-center gap-8 text-sm font-bold text-gray-300 lg:flex">
            <a className="text-violet-300" href="#">
              Home
            </a>
            <a className="transition hover:text-white" href="#">
              Tournaments
            </a>
            <a className="transition hover:text-white" href="#">
              Teams
            </a>
            <a className="transition hover:text-white" href="#">
              Leaderboard
            </a>
            <a className="transition hover:text-white" href="#">
              News
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white sm:inline-flex">
              Search
            </button>

            <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white transition hover:bg-violet-500">
              Profile
            </button>
          </div>
        </div>
      </header>

      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,8,17,0.98),rgba(7,8,17,0.72),rgba(7,8,17,0.98)),url('https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22)_0%,transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08)_0%,transparent_28%)]" />

        <div className="relative z-10 grid gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-24 2xl:px-16">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
              Ascendra tournament platform
            </p>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
              Run teams and tournaments without the clutter.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Create teams, join tournaments, manage registrations, and keep the
              Ascendra community organized through a clean competitive platform.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <PrimaryLink href="/tournaments">Explore tournaments</PrimaryLink>
              <SecondaryLink href="/profile">Create a team</SecondaryLink>
            </div>
          </div>

          <TournamentOverviewCard />
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

      <section className="relative z-10 px-6 py-20 lg:px-10 2xl:px-16">
        <SectionHeader
          label="How it works"
          title="A simple flow for players and admins."
          description="Each part of the platform has one clear purpose, so users know what to do without needing extra explanation."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              index={index + 1}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-black/20 px-6 py-20 lg:px-10 2xl:px-16">
        <SectionHeader
          label="Tournaments"
          title="Ascendra tournament list."
          description="The tournament page should stay clean and focused. Details and registration open in a separate focused page."
        />

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
          <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr_auto] border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-gray-500 lg:grid">
            <span>Tournament</span>
            <span>Game</span>
            <span>Team size</span>
            <span>Teams</span>
            <span>Status</span>
            <span></span>
          </div>

          {tournaments.map((tournament) => (
            <TournamentRow key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      <section className="relative z-10 grid gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-10 2xl:px-16">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-violet-300">
            Player experience
          </p>

          <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
            Profile should be clear, not crowded.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Players should see Discord status, invitations, teams, and
            tournament access clearly. Full team management should happen in
            focused pages, not all at once.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryLink href="/profile">Open profile</PrimaryLink>
            <SecondaryLink href="/tournaments">View tournaments</SecondaryLink>
          </div>
        </div>

        <ProfilePanel />
      </section>
    </main>
  );
}
