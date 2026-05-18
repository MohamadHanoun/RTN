import type { LeaderboardTeam } from "@/data/leaderboard";

type TeamLeaderboardTableProps = {
  teams: LeaderboardTeam[];
};

function RankBadge({ rank }: { rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <span
      className={`grid h-11 w-11 place-items-center rounded-xl border text-lg font-black ${
        isTopThree
          ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      }`}
    >
      #{rank}
    </span>
  );
}

export default function TeamLeaderboardTable({
  teams,
}: TeamLeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
          Team ranking
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Team tournament points
        </h2>
      </div>

      <div className="hidden border-b border-white/10 bg-black/20 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-400 lg:grid lg:grid-cols-[90px_minmax(0,1fr)_150px_150px_130px_130px_150px] lg:gap-5">
        <span>Rank</span>
        <span>Team</span>
        <span>Game</span>
        <span>Leader</span>
        <span>Members</span>
        <span>Best</span>
        <span>Points</span>
      </div>

      <div className="divide-y divide-white/10">
        {teams.map((team) => (
          <article
            key={team.id}
            className="grid gap-4 p-5 transition hover:bg-white/[0.035] lg:grid-cols-[90px_minmax(0,1fr)_150px_150px_130px_130px_150px] lg:items-center lg:gap-5"
          >
            <RankBadge rank={team.rank} />

            <div>
              <p className="text-lg font-black text-white">{team.name}</p>

              <p className="mt-1 text-sm text-gray-400">
                {team.tournamentResults} result
                {team.tournamentResults === 1 ? "" : "s"}
              </p>
            </div>

            <p className="text-sm font-bold text-cyan-300">{team.game}</p>

            <p className="text-sm text-gray-300">{team.leaderName}</p>

            <p className="text-sm text-gray-300">
              <span className="font-black text-white">{team.membersCount}</span>{" "}
              member{team.membersCount === 1 ? "" : "s"}
            </p>

            <p className="text-sm font-black text-yellow-300">
              {team.bestPlacement ? `#${team.bestPlacement}` : "-"}
            </p>

            <p className="text-sm font-black text-green-300">
              {team.tournamentPoints.toLocaleString()} points
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
