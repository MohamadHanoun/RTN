import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import type { LeaderboardUser } from "@/data/leaderboard";
import { getGameImageUrl } from "@/lib/tournamentImages";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "View RTN tournament points and player standings.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeaderboardPageProps = {
  searchParams: Promise<{
    game?: string;
  }>;
};

const games = ["Overall", "Valorant", "League of Legends", "CS2", "Dota2"];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function GameFilter({ selectedGame }: { selectedGame: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {games.map((game) => {
        const isActive = selectedGame === game;
        const href =
          game === "Overall"
            ? "/leaderboard"
            : `/leaderboard?game=${encodeURIComponent(game)}`;

        return (
          <Link
            key={game}
            href={href}
            className={`group overflow-hidden rounded-2xl border transition ${
              isActive
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.04] hover:border-cyan-400/30 hover:bg-white/[0.06]"
            }`}
          >
            <div
              className="min-h-28 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(11,15,26,0.05), rgba(11,15,26,0.82)), url("${getGameImageUrl(
                  game,
                )}")`,
              }}
            />

            <div className="p-4">
              <p
                className={`text-sm font-black ${
                  isActive ? "text-white" : "text-gray-300"
                }`}
              >
                {game}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {isActive ? "Selected ranking" : "View ranking"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function SelectedGameHero({
  selectedGame,
  rankedPlayers,
  totalPoints,
}: {
  selectedGame: string;
  rankedPlayers: number;
  totalPoints: number;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      <div
        className="relative min-h-72 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11,15,26,0.96), rgba(11,15,26,0.72), rgba(11,15,26,0.18)), url("${getGameImageUrl(
            selectedGame,
          )}")`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.24)_0%,transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14)_0%,transparent_26%)]" />

        <div className="relative z-10 flex min-h-72 max-w-3xl flex-col justify-end p-7">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
            {selectedGame === "Overall" ? "Overall Ranking" : "Game Ranking"}
          </p>

          <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">
            {selectedGame}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
            Tournament points are calculated from official RTN tournament
            results saved by admins.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-black text-white">
              {rankedPlayers} ranked player{rankedPlayers === 1 ? "" : "s"}
            </span>

            <span className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-black text-green-300">
              {totalPoints} total points
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

async function getLeaderboard(
  selectedGame: string,
): Promise<LeaderboardUser[]> {
  const users = await prisma.user.findMany({
    include: {
      teamMemberships: {
        include: {
          team: {
            include: {
              results: {
                select: {
                  id: true,
                  points: true,
                  placement: true,
                  tournament: {
                    select: {
                      game: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const leaderboardUsers = users
    .map((user) => {
      const userResults = user.teamMemberships.flatMap((membership) =>
        membership.team.results.filter((result) => {
          if (selectedGame === "Overall") {
            return true;
          }

          return result.tournament.game === selectedGame;
        }),
      );

      const tournamentResults = userResults.length;

      const tournamentPoints = userResults.reduce(
        (total, result) => total + result.points,
        0,
      );

      const bestPlacement =
        userResults.length > 0
          ? Math.min(...userResults.map((result) => result.placement))
          : null;

      return {
        id: user.id,
        username: user.username,
        role: user.role,
        tournamentResults,
        tournamentPoints,
        bestPlacement,
      };
    })
    .filter((user) => user.tournamentPoints > 0)
    .sort((a, b) => {
      if (b.tournamentPoints !== a.tournamentPoints) {
        return b.tournamentPoints - a.tournamentPoints;
      }

      if (b.tournamentResults !== a.tournamentResults) {
        return b.tournamentResults - a.tournamentResults;
      }

      return (a.bestPlacement || 999) - (b.bestPlacement || 999);
    });

  return leaderboardUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const params = await searchParams;
  const selectedGame = games.includes(params.game || "")
    ? params.game || "Overall"
    : "Overall";

  const leaderboardUsers = await getLeaderboard(selectedGame);

  const totalPoints = leaderboardUsers.reduce(
    (total, user) => total + user.tournamentPoints,
    0,
  );

  const totalResults = leaderboardUsers.reduce(
    (total, user) => total + user.tournamentResults,
    0,
  );

  const topPlayer = leaderboardUsers[0]?.username || "-";

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Leaderboard"
        title="Tournament points standings."
        description="View RTN players ranked by official tournament points from saved tournament results."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6">
          <GameFilter selectedGame={selectedGame} />

          <SelectedGameHero
            selectedGame={selectedGame}
            rankedPlayers={leaderboardUsers.length}
            totalPoints={totalPoints}
          />

          {leaderboardUsers.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Ranked players"
                  value={leaderboardUsers.length}
                />
                <StatCard label="Total points" value={totalPoints} />
                <StatCard label="Total results" value={totalResults} />
                <StatCard label="Top player" value={topPlayer} />
              </div>

              <LeaderboardTable users={leaderboardUsers} />
            </>
          ) : (
            <EmptyState
              title="No tournament points yet"
              description={
                selectedGame === "Overall"
                  ? "Player rankings will appear here when tournament results are added."
                  : `No tournament points have been awarded for ${selectedGame} yet.`
              }
              actionLabel="View tournaments"
              actionHref="/tournaments"
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
