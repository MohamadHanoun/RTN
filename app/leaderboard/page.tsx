import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import TeamLeaderboardTable from "@/components/TeamLeaderboardTable";
import type { LeaderboardTeam, LeaderboardUser } from "@/data/leaderboard";
import { prisma } from "@/lib/prisma";
import { getGameImageUrl } from "@/lib/tournamentImages";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "View RTN tournament points and player standings.",
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
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
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-2">
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
            className={`rounded-xl border px-4 py-3 transition ${
              isActive
                ? "border-indigo-400 bg-indigo-500/10 text-white"
                : "border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <p className="font-black">{item.label}</p>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
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
              {rankedItems} ranked {itemLabel}
              {rankedItems === 1 ? "" : "s"}
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
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Leaderboard"
        title="Tournament points standings."
        description="View RTN players and teams ranked by official tournament points from saved tournament results."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6">
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
