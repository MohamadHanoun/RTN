import type { LeaderboardTeam } from "@/data/leaderboard";

type TeamLeaderboardTableProps = {
  teams: LeaderboardTeam[];
};

function getRankLabel(rank: number) {
  if (rank === 1) {
    return "Champion team";
  }

  if (rank === 2) {
    return "Runner-up team";
  }

  if (rank === 3) {
    return "Third place team";
  }

  return "Ranked team";
}

function RankBadge({ rank }: { rank: number }) {
  const topThree = rank <= 3;

  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-2xl border text-lg font-black ${
        topThree
          ? "border-yellow-400/25 bg-yellow-500/10 text-yellow-300"
          : "border-violet-400/25 bg-violet-500/10 text-violet-200"
      }`}
    >
      #{rank}
    </span>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-black ${
          highlight ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function GameBadge({ game }: { game: string }) {
  return (
    <span className="inline-flex w-fit rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-200">
      {game}
    </span>
  );
}

function PodiumCard({ team }: { team: LeaderboardTeam }) {
  const isFirst = team.rank === 1;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 ${
        isFirst
          ? "border-yellow-400/25 bg-yellow-500/10"
          : "border-white/10 bg-white/[0.045]"
      }`}
    >
      <div className="absolute right-5 top-4 text-7xl font-black leading-none text-white/[0.035]">
        #{team.rank}
      </div>

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <RankBadge rank={team.rank} />
          <GameBadge game={team.game} />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
          {getRankLabel(team.rank)}
        </p>

        <h3 className="mt-2 truncate text-2xl font-black text-white">
          {team.name}
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Led by{" "}
          <span className="font-black text-white">{team.leaderName}</span>
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Points"
            value={team.tournamentPoints.toLocaleString()}
            highlight
          />
          <Metric label="Results" value={team.tournamentResults} />
          <Metric
            label="Best"
            value={team.bestPlacement ? `#${team.bestPlacement}` : "-"}
          />
        </div>
      </div>
    </article>
  );
}

function RankingRow({ team }: { team: LeaderboardTeam }) {
  return (
    <article className="grid gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 transition hover:border-violet-400/25 hover:bg-white/[0.045] lg:grid-cols-[70px_minmax(0,1fr)_130px_150px_120px_120px_150px] lg:items-center">
      <RankBadge rank={team.rank} />

      <div className="min-w-0">
        <p className="truncate text-lg font-black text-white">{team.name}</p>

        <p className="mt-1 text-sm text-gray-400">
          {team.tournamentResults} result
          {team.tournamentResults === 1 ? "" : "s"}
        </p>
      </div>

      <GameBadge game={team.game} />

      <p className="text-sm text-gray-300">{team.leaderName}</p>

      <p className="text-sm text-gray-300">
        <span className="font-black text-white">{team.membersCount}</span>{" "}
        member{team.membersCount === 1 ? "" : "s"}
      </p>

      <p className="text-sm font-black text-yellow-300">
        {team.bestPlacement ? `#${team.bestPlacement}` : "-"}
      </p>

      <p className="text-sm font-black text-emerald-300">
        {team.tournamentPoints.toLocaleString()} pts
      </p>
    </article>
  );
}

export default function TeamLeaderboardTable({
  teams,
}: TeamLeaderboardTableProps) {
  const podium = teams.slice(0, 3);
  const remaining = teams.slice(3);

  return (
    <section className="grid gap-6">
      {podium.length > 0 && (
        <section className="grid gap-4 lg:grid-cols-3">
          {podium.map((team) => (
            <PodiumCard key={team.id} team={team} />
          ))}
        </section>
      )}

      {remaining.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                Ranking list
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Teams outside the podium
              </h2>
            </div>

            <p className="text-sm font-bold text-gray-400">
              {remaining.length} ranked team
              {remaining.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-3">
            {remaining.map((team) => (
              <RankingRow key={team.id} team={team} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
