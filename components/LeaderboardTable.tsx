import type { LeaderboardUser } from "@/data/leaderboard";

type LeaderboardTableProps = {
  users: LeaderboardUser[];
};

function getRankLabel(rank: number) {
  if (rank === 1) {
    return "Champion";
  }

  if (rank === 2) {
    return "Runner-up";
  }

  if (rank === 3) {
    return "Third place";
  }

  return "Ranked player";
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

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role.toLowerCase() === "admin";

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${
        isAdmin
          ? "border-red-400/25 bg-red-500/10 text-red-300"
          : "border-violet-400/25 bg-violet-500/10 text-violet-200"
      }`}
    >
      {role}
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

function PodiumCard({ user }: { user: LeaderboardUser }) {
  const isFirst = user.rank === 1;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 ${
        isFirst
          ? "border-yellow-400/25 bg-yellow-500/10"
          : "border-white/10 bg-white/[0.045]"
      }`}
    >
      <div className="absolute right-5 top-4 text-7xl font-black leading-none text-white/[0.035]">
        #{user.rank}
      </div>

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <RankBadge rank={user.rank} />
          <RoleBadge role={user.role} />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
          {getRankLabel(user.rank)}
        </p>

        <h3 className="mt-2 truncate text-2xl font-black text-white">
          {user.username}
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Points"
            value={user.tournamentPoints.toLocaleString()}
            highlight
          />
          <Metric label="Results" value={user.tournamentResults} />
          <Metric
            label="Best"
            value={user.bestPlacement ? `#${user.bestPlacement}` : "-"}
          />
        </div>
      </div>
    </article>
  );
}

function RankingRow({ user }: { user: LeaderboardUser }) {
  return (
    <article className="grid gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 transition hover:border-violet-400/25 hover:bg-white/[0.045] lg:grid-cols-[70px_minmax(0,1fr)_120px_120px_120px_150px] lg:items-center">
      <RankBadge rank={user.rank} />

      <div className="min-w-0">
        <p className="truncate text-lg font-black text-white">
          {user.username}
        </p>

        <div className="mt-2 lg:hidden">
          <RoleBadge role={user.role} />
        </div>
      </div>

      <div className="hidden lg:block">
        <RoleBadge role={user.role} />
      </div>

      <p className="text-sm text-gray-300">
        <span className="font-black text-white">{user.tournamentResults}</span>{" "}
        result{user.tournamentResults === 1 ? "" : "s"}
      </p>

      <p className="text-sm font-black text-yellow-300">
        {user.bestPlacement ? `#${user.bestPlacement}` : "-"}
      </p>

      <p className="text-sm font-black text-emerald-300">
        {user.tournamentPoints.toLocaleString()} pts
      </p>
    </article>
  );
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  const podium = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <section className="grid gap-6">
      {podium.length > 0 && (
        <section className="grid gap-4 lg:grid-cols-3">
          {podium.map((user) => (
            <PodiumCard key={user.id} user={user} />
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
                Players outside the podium
              </h2>
            </div>

            <p className="text-sm font-bold text-gray-400">
              {remaining.length} ranked player
              {remaining.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-3">
            {remaining.map((user) => (
              <RankingRow key={user.id} user={user} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
