import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatsDetailCard from "@/components/StatsDetailCard";
import { prisma } from "@/lib/prisma";
import { getGameImageUrl } from "@/lib/tournamentImages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const games = ["Valorant", "League of Legends", "CS2", "Dota2"];

function GameStatRow({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "points";
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
        variant === "points"
          ? "border-emerald-400/25 bg-emerald-500/10"
          : "border-white/10 bg-black/25"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.14em] ${
          variant === "points" ? "text-emerald-300" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p className="text-lg font-black text-white">{value}</p>
    </div>
  );
}

function GameStatsCard({
  game,
  tournaments,
  results,
  points,
}: {
  game: string;
  tournaments: number;
  results: number;
  points: number;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div
        className="min-h-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(7,8,17,0.08), rgba(7,8,17,0.88)), url("${getGameImageUrl(
            game,
          )}")`,
        }}
      />

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
          Game stats
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">{game}</h2>

        <div className="mt-5 grid gap-2">
          <GameStatRow label="Tournaments" value={tournaments} />
          <GameStatRow label="Results" value={results} />
          <GameStatRow label="Points" value={points} variant="points" />
        </div>
      </div>
    </article>
  );
}

async function getStatsData() {
  const [
    rulesCount,
    rolesCount,
    staffCount,
    tournamentsCount,
    announcementsCount,
    usersCount,
    teamsCount,
    approvedRegistrationsCount,
    tournamentResults,
    tournamentPoints,
    tournamentsByGame,
  ] = await Promise.all([
    prisma.rule.count({ where: { isActive: true } }),
    prisma.role.count({ where: { isActive: true } }),
    prisma.staffMember.count({ where: { isActive: true } }),
    prisma.tournament.count(),
    prisma.announcement.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.team.count(),
    prisma.tournamentRegistration.count({
      where: {
        status: "approved",
      },
    }),
    prisma.tournamentResult.findMany({
      select: {
        points: true,
        tournament: {
          select: {
            game: true,
          },
        },
      },
    }),
    prisma.tournamentResult.aggregate({
      _sum: {
        points: true,
      },
    }),
    prisma.tournament.groupBy({
      by: ["game"],
      _count: {
        id: true,
      },
    }),
  ]);

  const gameStats = games.map((game) => {
    const gameResults = tournamentResults.filter(
      (result) => result.tournament.game === game,
    );

    const gamePoints = gameResults.reduce(
      (total, result) => total + result.points,
      0,
    );

    const gameTournamentCount =
      tournamentsByGame.find((item) => item.game === game)?._count.id || 0;

    return {
      game,
      tournaments: gameTournamentCount,
      results: gameResults.length,
      points: gamePoints,
    };
  });

  const overviewStats = [
    {
      title: "Players",
      value: String(usersCount),
      description: "Players who have logged in with Discord.",
    },
    {
      title: "Teams",
      value: String(teamsCount),
      description: "Teams created by Ascendra players.",
    },
    {
      title: "Tournaments",
      value: String(tournamentsCount),
      description: "Tournament records available on Ascendra.",
    },
    {
      title: "Tournament Results",
      value: String(tournamentResults.length),
      description: "Final tournament results saved by admins.",
    },
    {
      title: "Tournament Points",
      value: String(tournamentPoints._sum.points || 0),
      description: "Total points awarded from tournament results.",
    },
    {
      title: "Approved Registrations",
      value: String(approvedRegistrationsCount),
      description: "Tournament registrations approved by admins.",
    },
    {
      title: "Announcements",
      value: String(announcementsCount),
      description: "Published community announcements.",
    },
    {
      title: "Rules",
      value: String(rulesCount),
      description: "Active community rules.",
    },
    {
      title: "Roles",
      value: String(rolesCount),
      description: "Active community roles.",
    },
    {
      title: "Staff",
      value: String(staffCount),
      description: "Visible staff members.",
    },
  ];

  return {
    overviewStats,
    gameStats,
  };
}

export default async function StatsPage() {
  const { overviewStats, gameStats } = await getStatsData();

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
              Ascendra stats
            </p>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
              Community statistics.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Current Ascendra numbers for players, teams, tournaments, results,
              points, and game activity.
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

        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {overviewStats.map((item) => (
              <StatsDetailCard
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
              />
            ))}
          </div>

          <section className="grid gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
                Game breakdown
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                Stats by game
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                Tournament activity grouped by game, including saved results and
                awarded points.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {gameStats.map((item) => (
                <GameStatsCard
                  key={item.game}
                  game={item.game}
                  tournaments={item.tournaments}
                  results={item.results}
                  points={item.points}
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
