import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
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
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
        variant === "points"
          ? "border-green-500/20 bg-green-500/10"
          : "border-white/10 bg-black/25"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.12em] ${
          variant === "points" ? "text-green-300" : "text-gray-500"
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
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-cyan-400/30 hover:bg-white/[0.06]">
      <div
        className="min-h-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,26,0.08), rgba(11,15,26,0.86)), url("${getGameImageUrl(
            game,
          )}")`,
        }}
      />

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
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
      description: "Teams created by RTN players.",
    },
    {
      title: "Tournaments",
      value: String(tournamentsCount),
      description: "Tournament records available on RTN.",
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
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Stats"
        title="Community statistics."
        description="Current RTN numbers for players, teams, tournaments, tournament results, points, and game activity."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24">
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
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
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
    </main>
  );
}
