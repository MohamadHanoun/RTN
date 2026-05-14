import type { Tournament } from "@/data/tournaments";

type TournamentCardProps = {
  tournament: Tournament;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const statusStyles = {
    open: "bg-green-500/20 text-green-300",
    upcoming: "bg-indigo-500/20 text-indigo-300",
    closed: "bg-red-500/20 text-red-300",
    finished: "bg-gray-500/20 text-gray-300",
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-gray-300">
          {tournament.game}
        </span>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${
            statusStyles[tournament.status]
          }`}
        >
          {tournament.status}
        </span>
      </div>

      <h2 className="mb-4 text-2xl font-bold">{tournament.title}</h2>

      <p className="mb-6 leading-7 text-gray-300">{tournament.description}</p>

      <div className="mb-6 grid gap-3 text-sm text-gray-300">
        <p>
          <span className="font-semibold text-white">Date:</span>{" "}
          {tournament.date}
        </p>
        <p>
          <span className="font-semibold text-white">Prize:</span>{" "}
          {tournament.prize}
        </p>
        <p>
          <span className="font-semibold text-white">Slots:</span>{" "}
          {tournament.teams}
        </p>
      </div>

      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-white/10 px-5 py-3 font-bold text-gray-400"
      >
        Registration Coming Soon
      </button>
    </article>
  );
}