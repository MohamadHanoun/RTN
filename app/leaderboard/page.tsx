import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";
import Navbar from "@/components/Navbar";
import TeamLeaderboardTable from "@/components/TeamLeaderboardTable";
import type { LeaderboardTeam, LeaderboardUser } from "@/data/leaderboard";
import { prisma } from "@/lib/prisma";
import { getGameImageUrl } from "@/lib/tournamentImages";

export const metadata: Metadata = {
  title: "Leaderboard | Ascendra",
  description: "View Ascendra tournament points and player standings.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeaderboardPageProps = {
  searchParams: Promise<{
    game?: string;
    type?: string;
  }>;
};

const games = ["Overall", "Valorant", "League of Legends", "CS2", "Dota2"];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function buildLeaderboardHref(game: string, type: "players" | "teams") {
  const params = new URLSearchParams();

  if (game !== "Overall") {
    params.set("game", game);
  }

  if (type === "teams") {
    params.set("type", "teams");
  }

  const query = params.toString();

  return query ? `/leaderboard?${query}` : "/leaderboard";
}

function RankingTypeFilter({
  selectedGame,
  selectedType,
}: {
  selectedGame: string;
  selectedType: "players" | "teams";
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 sm:grid-cols-2">
      {[
        {
          label: "Players",
          value: "players" as const,
          description: "Rank players by tournament points.",
        },
        {
          label: "Teams",
          value: "teams" as const,
          description: "Rank teams by tournament points.",
        },
      ].map((item) => {
        const isActive = selectedType === item.value;

        return (
          <Link
            key={item.value}
            href={buildLeaderboardHref(selectedGame, item.value)}
            className={`rounded-2xl border px-5 py-4 transition ${
              isActive
                ? "border-violet-400/35 bg-violet-500/15 text-white shadow-lg shadow-violet-950/20"
                : "border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <p className="font-black">{item.label}</p>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

function GameFilter({
  selectedGame,
  selectedType,
}: {
  selectedGame: string;
  selectedType: "players" | "teams";
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {games.map((game) => {
        const isActive = selectedGame === game;

        return (
          <Link
            key={game}
            href={buildLeaderboardHref(game, selectedType)}
            className={`group overflow-hidden rounded-3xl border shadow-2xl shadow-black/20 transition ${
              isActive
                ? "border-violet-400/35 bg-violet-500/10"
                : "border-white/10 bg-white/[0.04] hover:border-violet-400/30 hover:bg-white/[0.06]"
            }`}
          >
            <div
              className="min-h-28 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(7,8,17,0.08), rgba(7,8,17,0.86)), url("${getGameImageUrl(
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
  selectedType,
  rankedItems,
  totalPoints,
}: {
  selectedGame: string;
  selectedType: "players" | "teams";
  rankedItems: number;
  totalPoints: number;
}) {
  const itemLabel = selectedType === "players" ? "player" : "team";

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
      <div
        className="relative min-h-72 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7,8,17,0.96), rgba(7,8,17,0.72), rgba(7,8,17,0.18)), url("${getGameImageUrl(
            selectedGame,
          )}")`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.28)_0%,transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10)_0%,transparent_26%)]" />

        <div className="relative z-10 flex min-h-72 max-w-3xl flex-col justify-end p-7">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            {selectedGame === "Overall" ? "Overall ranking" : "Game ranking"}
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            {selectedGame}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
            Tournament points are calculated from official Ascendra tournament
            results saved by admins.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-black text-white">
              {rankedItems} ranked {itemLabel}
              {rankedItems === 1 ? "" : "s"}
            </span>

            <span className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-300">
              {totalPoints} total points
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

async function getPlayerLeaderboard(
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

async function getTeamLeaderboard(
  selectedGame: string,
): Promise<LeaderboardTeam[]> {
  const teams = await prisma.team.findMany({
    include: {
      leader: {
        select: {
          username: true,
        },
      },
      members: {
        select: {
          id: true,
        },
      },
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
  });

  const leaderboardTeams = teams
    .map((team) => {
      const teamResults = team.results.filter((result) => {
        if (selectedGame === "Overall") {
          return true;
        }

        return result.tournament.game === selectedGame;
      });

      const tournamentResults = teamResults.length;

      const tournamentPoints = teamResults.reduce(
        (total, result) => total + result.points,
        0,
      );

      const bestPlacement =
        teamResults.length > 0
          ? Math.min(...teamResults.map((result) => result.placement))
          : null;

      return {
        id: team.id,
        name: team.name,
        game: team.game,
        leaderName: team.leader.username,
        membersCount: team.members.length,
        tournamentResults,
        tournamentPoints,
        bestPlacement,
      };
    })
    .filter((team) => team.tournamentPoints > 0)
    .sort((a, b) => {
      if (b.tournamentPoints !== a.tournamentPoints) {
        return b.tournamentPoints - a.tournamentPoints;
      }

      if (b.tournamentResults !== a.tournamentResults) {
        return b.tournamentResults - a.tournamentResults;
      }

      return (a.bestPlacement || 999) - (b.bestPlacement || 999);
    });

  return leaderboardTeams.map((team, index) => ({
    ...team,
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

  const selectedType = params.type === "teams" ? "teams" : "players";

  const playerLeaderboard =
    selectedType === "players" ? await getPlayerLeaderboard(selectedGame) : [];

  const teamLeaderboard =
    selectedType === "teams" ? await getTeamLeaderboard(selectedGame) : [];

  const activeLeaderboard =
    selectedType === "players" ? playerLeaderboard : teamLeaderboard;

  const totalPoints = activeLeaderboard.reduce(
    (total, item) => total + item.tournamentPoints,
    0,
  );

  const totalResults = activeLeaderboard.reduce(
    (total, item) => total + item.tournamentResults,
    0,
  );

  const topItem =
    selectedType === "players"
      ? playerLeaderboard[0]?.username || "-"
      : teamLeaderboard[0]?.name || "-";

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage: `url("${getGameImageUrl(selectedGame)}")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070811]/70 via-[#070811]/88 to-[#070811]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.28)_0%,transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10)_0%,transparent_28%)]" />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-violet-300">
              Ascendra leaderboard
            </p>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl">
              Tournament points standings.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              View players and teams ranked by official tournament points from
              saved Ascendra tournament results.
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

        <section className="mx-auto grid max-w-[1440px] gap-6 px-6 py-12 lg:px-10">
          <RankingTypeFilter
            selectedGame={selectedGame}
            selectedType={selectedType}
          />

          <GameFilter selectedGame={selectedGame} selectedType={selectedType} />

          <SelectedGameHero
            selectedGame={selectedGame}
            selectedType={selectedType}
            rankedItems={activeLeaderboard.length}
            totalPoints={totalPoints}
          />

          {activeLeaderboard.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label={
                    selectedType === "players"
                      ? "Ranked players"
                      : "Ranked teams"
                  }
                  value={activeLeaderboard.length}
                />
                <StatCard label="Total points" value={totalPoints} />
                <StatCard label="Total results" value={totalResults} />
                <StatCard
                  label={selectedType === "players" ? "Top player" : "Top team"}
                  value={topItem}
                />
              </div>

              {selectedType === "players" ? (
                <LeaderboardTable users={playerLeaderboard} />
              ) : (
                <TeamLeaderboardTable teams={teamLeaderboard} />
              )}
            </>
          ) : (
            <EmptyState
              title="No tournament points yet"
              description={
                selectedGame === "Overall"
                  ? selectedType === "players"
                    ? "Player rankings will appear here when tournament results are added."
                    : "Team rankings will appear here when tournament results are added."
                  : `No tournament points have been awarded for ${selectedGame} yet.`
              }
              actionLabel="View tournaments"
              actionHref="/tournaments"
            />
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
