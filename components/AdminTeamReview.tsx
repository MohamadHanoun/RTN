import { deleteTeamInline } from "@/actions/adminTeamInlineActions";
import InlineAdminActionForm from "@/components/InlineAdminActionForm";
import ProfileNotice from "@/components/ProfileNotice";
import { prisma } from "@/lib/prisma";

type AdminTeamReviewProps = {
  message?: string;
  error?: string;
};

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    approved: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    active: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    draft: "border-white/10 bg-white/5 text-gray-300",
    pending: "border-yellow-400/25 bg-yellow-500/10 text-yellow-300",
    rejected: "border-red-400/25 bg-red-500/10 text-red-300",
  };

  const label = normalizedStatus === "approved" ? "Active" : status;

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {label}
    </span>
  );
}

function RoleBadge({ leader }: { leader: boolean }) {
  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${
        leader
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
          : "border-violet-400/25 bg-violet-500/10 text-violet-200"
      }`}
    >
      {leader ? "Leader" : "Member"}
    </span>
  );
}

function RegistrationBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    registered: "border-cyan-400/25 bg-cyan-500/10 text-cyan-300",
    approved: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    rejected: "border-red-400/25 bg-red-500/10 text-red-300",
    cancelled: "border-white/10 bg-white/5 text-gray-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <p>
      {label}: <span className="break-all font-black text-white">{value}</span>
    </p>
  );
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Not set";
  }

  return date.toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminTeamReview({
  message,
  error,
}: AdminTeamReviewProps) {
  const teams = await prisma.team.findMany({
    include: {
      leader: true,
      members: {
        include: {
          user: true,
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
      registrations: {
        include: {
          tournament: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      results: {
        include: {
          tournament: true,
        },
        orderBy: [
          {
            awardedAt: "desc",
          },
        ],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 80,
  });

  const teamsWithStats = teams.map((team) => {
    const tournamentPoints = team.results.reduce(
      (total, result) => total + result.points,
      0,
    );

    const bestPlacement =
      team.results.length > 0
        ? Math.min(...team.results.map((result) => result.placement))
        : null;

    return {
      ...team,
      tournamentPoints,
      bestPlacement,
    };
  });

  const totalPlayers = teamsWithStats.reduce(
    (sum, team) => sum + team.members.length,
    0,
  );

  const activeTeams = teamsWithStats.filter((team) => {
    const status = team.status.toLowerCase();

    return status === "approved" || status === "active";
  }).length;

  const totalTournamentPoints = teamsWithStats.reduce(
    (total, team) => total + team.tournamentPoints,
    0,
  );

  const teamsWithResults = teamsWithStats.filter(
    (team) => team.results.length > 0,
  ).length;

  return (
    <section className="grid gap-6">
      <ProfileNotice message={message} error={error} />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Teams
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Teams directory
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            View teams, leaders, players, registrations, tournament results, and
            points.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Teams" value={teamsWithStats.length} />
          <StatCard label="Active" value={activeTeams} />
          <StatCard label="Players" value={totalPlayers} />
          <StatCard label="Ranked" value={teamsWithResults} />
          <StatCard label="Points" value={totalTournamentPoints} />
        </div>
      </div>

      {teamsWithStats.length === 0 ? (
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-gray-300 shadow-2xl shadow-black/20">
          No teams found.
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
          <div className="hidden border-b border-white/10 bg-black/25 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 xl:grid xl:grid-cols-[minmax(0,1.1fr)_140px_140px_140px_140px_120px] xl:gap-5">
            <span>Team</span>
            <span>Players</span>
            <span>Regs.</span>
            <span>Results</span>
            <span>Best</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-white/10">
            {teamsWithStats.map((team) => (
              <article
                key={team.id}
                className="grid gap-4 p-5 transition hover:bg-white/[0.035]"
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_140px_140px_140px_140px_120px] xl:items-center xl:gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-2xl font-black text-white">
                        {team.name}
                      </h2>

                      <StatusBadge status={team.status} />

                      <span className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-black text-violet-200">
                        {team.game}
                      </span>

                      {team.tournamentPoints > 0 && (
                        <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                          {team.tournamentPoints} pts
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      Leader: {team.leader.username} · Created{" "}
                      {formatDate(team.createdAt)}
                    </p>
                  </div>

                  <MiniStat label="Players" value={team.members.length} />
                  <MiniStat label="Regs." value={team.registrations.length} />
                  <MiniStat label="Results" value={team.results.length} />
                  <MiniStat
                    label="Best"
                    value={team.bestPlacement ? `#${team.bestPlacement}` : "-"}
                  />

                  <details className="group">
                    <summary className="cursor-pointer list-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white">
                      Details
                    </summary>
                  </details>
                </div>

                <details className="rounded-2xl border border-white/10 bg-black/25">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-black text-gray-300 transition hover:text-white">
                    Team details and actions
                  </summary>

                  <div className="grid gap-5 border-t border-white/10 p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_280px] xl:items-start">
                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                        Team info
                      </p>

                      <div className="mt-4 grid gap-3 text-sm text-gray-300">
                        <InfoRow label="Team name" value={team.name} />
                        <InfoRow label="Game" value={team.game} />
                        <InfoRow label="Leader" value={team.leader.username} />
                        <InfoRow
                          label="Leader Discord ID"
                          value={team.leader.discordId}
                        />
                        <InfoRow label="Players" value={team.members.length} />
                        <InfoRow
                          label="Registrations"
                          value={team.registrations.length}
                        />
                        <InfoRow label="Results" value={team.results.length} />
                        <InfoRow
                          label="Tournament points"
                          value={team.tournamentPoints}
                        />
                        <InfoRow
                          label="Best placement"
                          value={
                            team.bestPlacement ? `#${team.bestPlacement}` : "-"
                          }
                        />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                        Players
                      </p>

                      <div className="mt-4 grid gap-2">
                        {team.members.length === 0 ? (
                          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-gray-400">
                            No players in this team.
                          </div>
                        ) : (
                          team.members.map((member) => {
                            const isLeader = member.userId === team.leaderId;

                            return (
                              <div
                                key={member.id}
                                className="grid gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                              >
                                <div>
                                  <p className="font-black text-white">
                                    {member.user.username}
                                  </p>

                                  <p className="mt-1 break-all text-xs text-gray-500">
                                    {member.user.discordId}
                                  </p>
                                </div>

                                <RoleBadge leader={isLeader} />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </section>

                    <aside className="grid content-start gap-4">
                      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                          Results
                        </p>

                        <div className="mt-4 grid gap-2">
                          {team.results.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-gray-400">
                              No tournament results.
                            </div>
                          ) : (
                            team.results.slice(0, 4).map((result) => (
                              <div
                                key={result.id}
                                className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                              >
                                <p className="text-sm font-black text-white">
                                  {result.tournament.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  #{result.placement} · {result.points} pts
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                          Registrations
                        </p>

                        <div className="mt-4 grid gap-2">
                          {team.registrations.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-gray-400">
                              No tournament registrations.
                            </div>
                          ) : (
                            team.registrations
                              .slice(0, 4)
                              .map((registration) => (
                                <div
                                  key={registration.id}
                                  className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                                >
                                  <p className="text-sm font-black text-white">
                                    {registration.tournament.title}
                                  </p>

                                  <div className="mt-2">
                                    <RegistrationBadge
                                      status={registration.status}
                                    />
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">
                          Danger zone
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          Delete this team, its members, invitations,
                          registrations, and tournament results.
                        </p>

                        <div className="mt-3">
                          <InlineAdminActionForm
                            action={deleteTeamInline}
                            buttonLabel="Delete team"
                            pendingLabel="Deleting..."
                            variant="danger"
                            confirmTitle="Delete team?"
                            confirmDescription={`Are you sure you want to delete ${team.name}? This will remove the team, members, invitations, registrations, and tournament results.`}
                            confirmLabel="Delete permanently"
                          >
                            <input
                              type="hidden"
                              name="teamId"
                              value={team.id}
                            />
                          </InlineAdminActionForm>
                        </div>
                      </section>
                    </aside>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
