import type { Tournament, TournamentStatus } from "@/data/tournaments";

type TournamentCardProps = {
  tournament: Tournament;
};

const statusColors: Record<TournamentStatus, string> = {
  open: "bg-green-500/20 text-green-300",
  upcoming: "bg-indigo-500/20 text-indigo-300",
  closed: "bg-red-500/20 text-red-300",
};

const buttonText: Record<TournamentStatus, string> = {
  open: "Login Required Later",
  upcoming: "Registration Coming Soon",
  closed: "Registration Closed",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-gray-300">
          {tournament.game}
        </span>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${
            statusColors[tournament.status]
          }`}
        >
          {tournament.status}
        </span>
      </div>

      <h2 className="mb-4 text-2xl font-bold">{tournament.title}</h2>

      <p className="mb-6 flex-1 leading-7 text-gray-300">
        {tournament.description}
      </p>

      <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="mb-3 text-sm text-gray-300">
          <span className="font-bold text-white">Date:</span> {tournament.date}
        </p>

        <p className="mb-3 text-sm text-gray-300">
          <span className="font-bold text-white">Prize:</span>{" "}
          {tournament.prize}
        </p>

        <p className="text-sm text-gray-300">
          <span className="font-bold text-white">Slots:</span>{" "}
          {tournament.teams}
        </p>
      </div>

      <button
        disabled
        className="mt-auto cursor-not-allowed rounded-xl bg-white/10 px-6 py-3 font-bold text-gray-400"
      >
        {buttonText[tournament.status]}
      </button>
    </article>
  );
}