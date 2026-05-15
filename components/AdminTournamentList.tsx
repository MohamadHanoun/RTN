import {
  deleteTournament,
  updateTournament,
} from "@/actions/tournamentActions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import { prisma } from "@/lib/prisma";

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
            Edit tournament details, change status, or delete tournaments from
            the RTN database.
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-300">
            No tournaments found yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {tournaments.map((tournament) => (
              <article
                key={tournament.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <form action={updateTournament} className="grid gap-4">
                  <input type="hidden" name="id" value={tournament.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">
                        Title
                      </span>

                      <input
                        name="title"
                        defaultValue={tournament.title}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">Game</span>

                      <input
                        name="game"
                        defaultValue={tournament.game}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">Date</span>

                      <input
                        name="date"
                        defaultValue={tournament.date}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">
                        Prize
                      </span>

                      <input
                        name="prize"
                        defaultValue={tournament.prize}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">
                        Max Slots
                      </span>

                      <input
                        name="maxSlots"
                        type="number"
                        min="1"
                        defaultValue={tournament.maxSlots}
                        required
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="font-semibold text-gray-200">
                        Status
                      </span>

                      <select
                        name="status"
                        defaultValue={tournament.status}
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                      >
                        <option value="open">Open</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="closed">Closed</option>
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="font-semibold text-gray-200">
                      Description
                    </span>

                    <textarea
                      name="description"
                      defaultValue={tournament.description}
                      required
                      rows={4}
                      className="resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-xl border border-cyan-500/20 px-4 py-2 font-bold text-cyan-300 transition hover:bg-cyan-500/10"
                    >
                      Save Changes
                    </button>

                    <ConfirmDeleteForm
                      id={tournament.id}
                      action={deleteTournament}
                      message="Are you sure you want to delete this tournament?"
                    />
                  </div>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}