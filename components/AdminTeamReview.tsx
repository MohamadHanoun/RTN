import {
  approveTeam,
  deleteTeamAsAdmin,
  rejectTeam,
} from "@/actions/adminTeamActions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import EmptyState from "@/components/EmptyState";
import ProfileNotice from "@/components/ProfileNotice";
import { prisma } from "@/lib/prisma";

type AdminTeamReviewProps = {
  message?: string;
  error?: string;
};

function statusStyle(status: string) {
  if (status === "approved") {
    return "bg-green-500/20 text-green-300";
  }

  if (status === "pending") {
    return "bg-yellow-500/20 text-yellow-300";
  }

  if (status === "rejected") {
    return "bg-red-500/20 text-red-300";
  }

  return "bg-indigo-500/20 text-indigo-300";
}

function statusLabel(status: string) {
  if (status === "approved") {
    return "Approved";
  }

  if (status === "pending") {
    return "Pending";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return "Draft";
}

export default async function AdminTeamReview({
  message,
  error,
}: AdminTeamReviewProps) {
  const teams = await prisma.team.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
      invites: {
        where: {
          status: "pending",
        },
        include: {
          invitedUser: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const pendingTeams = teams.filter((team) => team.status === "pending");
  const otherTeams = teams.filter((team) => team.status !== "pending");

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <ProfileNotice message={message} error={error} />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Team Review
          </p>

          <h2 className="text-3xl font-black">Manage Team Requests</h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-300">
            Review submitted RTN teams, check members, approve requests, reject
            requests with a reason, or delete teams when needed.
          </p>
        </div>

        {teams.length === 0 ? (
          <EmptyState
            title="No teams yet"
            description="Team requests will appear here after players create and submit teams for review."
          />
        ) : (
          <div className="grid gap-8">
            <section>
              <h3 className="mb-4 text-2xl font-black">Pending Review</h3>

              {pendingTeams.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300">
                  No pending teams right now.
                </div>
              ) : (
                <div className="grid gap-5">
                  {pendingTeams.map((team) => (
                    <article
                      key={team.id}
                      className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5"
                    >
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-2xl font-black">{team.name}</h4>

                          <p className="mt-2 text-gray-300">
                            {team.game} • Leader: {team.leader.username}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-1 text-sm font-bold ${statusStyle(
                            team.status,
                          )}`}
                        >
                          {statusLabel(team.status)}
                        </span>
                      </div>

                      <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">
                        <h5 className="mb-3 font-bold">Members</h5>

                        {team.members.length === 0 ? (
                          <p className="text-gray-300">No members found.</p>
                        ) : (
                          <div className="grid gap-2">
                            {team.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3"
                              >
                                <span className="font-semibold">
                                  {member.user.username}
                                </span>

                                <span className="text-sm capitalize text-gray-400">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {team.invites.length > 0 && (
                        <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">
                          <h5 className="mb-3 font-bold">Pending Invites</h5>

                          <div className="grid gap-2">
                            {team.invites.map((invite) => (
                              <div
                                key={invite.id}
                                className="rounded-xl bg-white/5 px-4 py-3 text-gray-300"
                              >
                                {invite.invitedUser.username}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4">
                        <div className="grid gap-3 sm:flex sm:flex-wrap">
                          <form action={approveTeam}>
                            <input
                              type="hidden"
                              name="teamId"
                              value={team.id}
                            />

                            <button
                              type="submit"
                              className="w-full rounded-xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-400 sm:w-auto"
                            >
                              Approve Team
                            </button>
                          </form>

                          <ConfirmDeleteForm
                            id={team.id}
                            action={deleteTeamAsAdmin}
                            message="Are you sure you want to delete this team? This will remove the team, members, invites, and registrations."
                          />
                        </div>

                        <form
                          action={rejectTeam}
                          className="grid gap-3 sm:flex"
                        >
                          <input type="hidden" name="teamId" value={team.id} />

                          <input
                            name="rejectionReason"
                            required
                            placeholder="Reason for rejection"
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-400"
                          />

                          <button
                            type="submit"
                            className="rounded-xl border border-red-500/20 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/10"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-4 text-2xl font-black">All Teams</h3>

              {otherTeams.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300">
                  No other teams yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {otherTeams.map((team) => (
                    <article
                      key={team.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-xl font-black">{team.name}</h4>

                          <p className="mt-2 text-gray-300">
                            {team.game} • Leader: {team.leader.username} •{" "}
                            {team.members.length} members
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-1 text-sm font-bold ${statusStyle(
                            team.status,
                          )}`}
                        >
                          {statusLabel(team.status)}
                        </span>
                      </div>

                      {team.rejectionReason && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                          <p className="mb-2 font-bold text-red-300">
                            Rejection reason
                          </p>

                          <p className="leading-7 text-gray-300">
                            {team.rejectionReason}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                        <h5 className="mb-3 font-bold">Members</h5>

                        {team.members.length === 0 ? (
                          <p className="text-gray-300">No members found.</p>
                        ) : (
                          <div className="grid gap-2">
                            {team.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/20 px-4 py-3"
                              >
                                <span className="font-semibold">
                                  {member.user.username}
                                </span>

                                <span className="text-sm capitalize text-gray-400">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        <ConfirmDeleteForm
                          id={team.id}
                          action={deleteTeamAsAdmin}
                          message="Are you sure you want to delete this team? This action cannot be undone."
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
