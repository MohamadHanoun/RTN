import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTournamentImageUrl } from "@/lib/tournamentImages";

function StatusBadge({ label, status }: { label: string; status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    open: "border-green-500/20 bg-green-500/10 text-green-300",
    upcoming: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    closed: "border-red-500/20 bg-red-500/10 text-red-300",
    cancelled: "border-white/10 bg-white/5 text-gray-300",
    registered: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    approved: "border-green-500/20 bg-green-500/10 text-green-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {label}: {status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

export default async function AdminTournamentList() {
  const tournaments = await prisma.tournament.findMany({
    include: {
      registrations: {
        where: {
          status: {
            in: ["registered", "approved"],
          },
        },
        select: {
          id: true,
          status: true,
        },
      },
      results: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const openTournaments = tournaments.filter(
    (tournament) => tournament.status === "open",
  ).length;

  const openRegistrations = tournaments.filter(
    (tournament) => tournament.registrationStatus === "open",
  ).length;

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
            Manage Tournaments
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Tournament list
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            View tournaments, check their current status, and open a dedicated
            management page for editing, results, and points.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total" value={tournaments.length} />
          <StatCard label="Open" value={openTournaments} />
          <StatCard label="Reg. open" value={openRegistrations} />
        </div>
      </div>

      {tournaments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
          No tournaments found.
        </div>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((tournament) => {
            const usedSlots = tournament.registrations.length;
            const remainingSlots = Math.max(tournament.maxSlots - usedSlots, 0);
            const tournamentImage = getTournamentImageUrl(
              tournament.game,
              tournament.imageUrl,
            );

            return (
              <article
                key={tournament.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <div className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)_340px_140px] lg:items-stretch">
                  <div
                    className="min-h-40 bg-cover bg-center lg:min-h-full"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(11,15,26,0.05), rgba(11,15,26,0.78)), url("${tournamentImage}")`,
                    }}
                  />

                  <div className="grid content-center gap-3 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-white">
                        {tournament.title}
                      </h3>

                      {tournament.results.length > 0 && (
                        <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-black text-green-300">
                          Results: {tournament.results.length}
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-6 text-gray-400">
                      {tournament.game} · {tournament.date}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        label="Tournament"
                        status={tournament.status}
                      />
                      <StatusBadge
                        label="Registration"
                        status={tournament.registrationStatus}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-white/10 p-5 lg:border-l lg:border-t-0">
                    <StatCard label="Slots" value={tournament.maxSlots} />
                    <StatCard label="Used" value={usedSlots} />
                    <StatCard label="Left" value={remainingSlots} />
                  </div>

                  <div className="grid content-center border-t border-white/10 p-5 lg:border-l lg:border-t-0">
                    <Link
                      href={`/admin/tournaments/${tournament.id}`}
                      className="rounded-xl bg-indigo-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-indigo-400"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
