import { createTournament } from "@/actions/tournamentActions";

const games = ["Valorant", "League of Legends", "CS2", "Dota2"];

export default function AdminTournamentForm() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Tournament Manager
          </p>

          <h2 className="text-3xl font-black">Create Tournament</h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-300">
            Create a tournament, choose the game, team size, slots, and whether
            registration is open or closed.
          </p>
        </div>

        <form action={createTournament} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Title</span>

              <input
                name="title"
                required
                placeholder="Example: RTN Valorant Cup"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Game</span>

              <select
                name="game"
                required
                defaultValue=""
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="" disabled>
                  Select game
                </option>

                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Date</span>

              <input
                name="date"
                required
                placeholder="Example: 2026-06-15"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Prize</span>

              <input
                name="prize"
                required
                placeholder="Example: 500 SEK"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Max Teams</span>

              <input
                name="maxSlots"
                type="number"
                min="1"
                required
                placeholder="16"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">Team Size</span>

              <input
                name="teamSize"
                type="number"
                min="1"
                required
                placeholder="5"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">
                Tournament Status
              </span>

              <select
                name="status"
                defaultValue="upcoming"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="upcoming">Upcoming</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-gray-200">
                Registration Status
              </span>

              <select
                name="registrationStatus"
                defaultValue="closed"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="closed">Closed</option>
                <option value="open">Open</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-200">Description</span>

            <textarea
              name="description"
              required
              rows={4}
              placeholder="Write a short tournament description..."
              className="resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-bold text-white transition hover:bg-cyan-400 sm:w-fit"
          >
            Create Tournament
          </button>
        </form>
      </div>
    </section>
  );
}
