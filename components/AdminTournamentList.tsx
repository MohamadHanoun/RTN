import {
  deleteTournament,
  updateTournamentStatus,
} from "@/actions/tournamentActions";
import { prisma } from "@/lib/prisma";
import ConfirmDeleteForm from "./ConfirmDeleteForm";

async function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

export default async function AdminTournamentList() {
  const tournaments = await getTournaments();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-black">Manage Tournaments</h2>

          <p className="max-w-2xl leading-7 text-gray-300">
            Review, update status, or delete tournaments from the RTN database.
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-300">
            No tournaments found yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {tournaments.map((tournament) => (
              <article
                key={tournament.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-300">
                        {tournament.game}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          tournament.status === "open"
                            ? "bg-green-500/20 text-green-300"
                            : tournament.status === "upcoming"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {tournament.status}
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-gray-300">
                        {tournament.maxSlots} slots
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold">{tournament.title}</h3>

                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {tournament.date} • {tournament.prize}
                    </p>

                    <p className="mt-3 max-w-3xl leading-7 text-gray-300">
                      {tournament.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={updateTournamentStatus} className="flex gap-3">
                    <input type="hidden" name="id" value={tournament.id} />

                    <select
                      name="status"
                      defaultValue={tournament.status}
                      className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none transition focus:border-cyan-400"
                    >
                      <option value="open">Open</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-xl border border-cyan-500/20 px-4 py-2 font-bold text-cyan-300 transition hover:bg-cyan-500/10"
                    >
                      Update Status
                    </button>
                  </form>

                  <ConfirmDeleteForm
                    id={tournament.id}
                    action={deleteTournament}
                    message="Are you sure you want to delete this tournament?"
                    />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}