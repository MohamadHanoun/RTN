import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  cancelTeamInvite,
  deleteTeam,
  invitePlayerToTeam,
  removeTeamMember,
  submitTeamForReview,
  updateTeam,
} from "@/actions/teamActions";
import ConfirmActionForm from "@/components/ConfirmActionForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileNotice from "@/components/ProfileNotice";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Team",
  description: "Manage your RTN team.",
};

type TeamDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

const games = ["Valorant", "League of Legends", "CS2", "Dota2"];

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    approved: "border-green-500/20 bg-green-500/10 text-green-300",
    leader: "border-green-500/20 bg-green-500/10 text-green-300",
    member: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    draft: "border-white/10 bg-white/5 text-gray-300",
    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    invited: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
    cancelled: "border-red-500/20 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex w-fit rounded border px-3 py-1 text-xs font-bold capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function PanelHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
        {label}
      </p>

      <h2 className="mt-2 text-xl font-black text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
    </div>
  );
}

export default async function TeamDetailsPage({
  params,
  searchParams,
}: TeamDetailsPageProps) {
  const { id } = await params;
  const noticeParams = await searchParams;
  const session = await auth();

  if (!session?.user?.databaseId) {
    redirect("/login");
  }

  const team = await prisma.team.findUnique({
    where: {
      id,
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
          invitedBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!team) {
    notFound();
  }

  const currentMembership = team.members.find(
    (member) => member.userId === session.user.databaseId,
  );

  const isLeader = team.leaderId === session.user.databaseId;
  const canManage = Boolean(currentMembership);
  const canEdit = isLeader && team.status !== "approved";
  const canSubmitForReview =
    isLeader && (team.status === "draft" || team.status === "rejected");
  const canDelete = isLeader && team.status !== "approved";

  if (!canManage) {
    redirect("/profile");
  }

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <ProfileNotice
          message={noticeParams.message}
          error={noticeParams.error}
        />

        <Link
          href="/profile"
          className="mb-6 inline-flex rounded border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to profile
        </Link>

        <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
                Team Management
              </p>

              <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                {team.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={team.status} />

                <span className="inline-flex rounded border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {team.game}
                </span>

                <span className="inline-flex rounded border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                  {team.members.length} member
                  {team.members.length === 1 ? "" : "s"}
                </span>

                {team.invites.length > 0 && (
                  <span className="inline-flex rounded border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                    {team.invites.length} pending invite
                    {team.invites.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {team.rejectionReason && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="font-black text-red-300">Team rejected</p>
                  <p className="mt-2 leading-7 text-gray-300">
                    Reason: {team.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2 text-sm text-gray-300 lg:text-right">
              <p>
                Leader:{" "}
                <span className="font-black text-white">
                  {team.leader.username}
                </span>
              </p>

              <p>
                Created:{" "}
                <span className="font-black text-white">
                  {team.createdAt.toLocaleDateString("en")}
                </span>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            <PanelHeader
              label="Players"
              title="Team players"
              description="Members and pending invitations are shown in one place."
            />

            <div className="divide-y divide-white/10">
              {team.members.map((member) => {
                const isMemberLeader = member.userId === team.leaderId;

                return (
                  <div
                    key={member.id}
                    className="grid gap-4 px-6 py-5 md:grid-cols-[1.2fr_1fr_140px_auto] md:items-center"
                  >
                    <div>
                      <p className="font-black text-white">
                        {member.user.username}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Discord ID: {member.user.discordId}
                      </p>
                    </div>

                    <div className="text-sm text-gray-400">Joined team</div>

                    <StatusBadge
                      status={isMemberLeader ? "Leader" : "Member"}
                    />

                    <div className="md:text-right">
                      {isLeader && !isMemberLeader && canEdit ? (
                        <ConfirmActionForm
                          action={removeTeamMember}
                          buttonLabel="Remove"
                          pendingLabel="Removing..."
                          title="Remove player?"
                          description={`Are you sure you want to remove ${member.user.username} from this team?`}
                          confirmLabel="Remove player"
                          hiddenFields={[
                            {
                              name: "teamId",
                              value: team.id,
                            },
                            {
                              name: "memberId",
                              value: member.id,
                            },
                          ]}
                        />
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {team.invites.map((invite) => (
                <div
                  key={invite.id}
                  className="grid gap-4 px-6 py-5 md:grid-cols-[1.2fr_1fr_140px_auto] md:items-center"
                >
                  <div>
                    <p className="font-black text-white">
                      {invite.invitedUser.username}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Discord ID: {invite.invitedUser.discordId}
                    </p>
                  </div>

                  <div className="text-sm text-gray-400">
                    Waiting for player response
                  </div>

                  <StatusBadge status="Invited" />

                  <div className="md:text-right">
                    {canEdit ? (
                      <ConfirmActionForm
                        action={cancelTeamInvite}
                        buttonLabel="Cancel"
                        pendingLabel="Cancelling..."
                        title="Cancel invitation?"
                        description={`Cancel the invitation sent to ${invite.invitedUser.username}?`}
                        confirmLabel="Cancel invite"
                        variant="secondary"
                        hiddenFields={[
                          {
                            name: "teamId",
                            value: team.id,
                          },
                          {
                            name: "inviteId",
                            value: invite.id,
                          },
                        ]}
                      />
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </div>
                </div>
              ))}

              {team.members.length === 0 && team.invites.length === 0 && (
                <div className="p-6 text-gray-300">
                  No players in this team yet.
                </div>
              )}
            </div>
          </section>

          <aside className="grid content-start gap-6">
            <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              <PanelHeader
                label="Controls"
                title="Team controls"
                description="Edit, invite, and submit from one focused panel."
              />

              <div className="grid gap-6 p-5">
                <div>
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-gray-500">
                    Settings
                  </p>

                  {canEdit ? (
                    <form action={updateTeam} className="grid gap-4">
                      <input type="hidden" name="teamId" value={team.id} />

                      <label className="grid gap-2">
                        <span className="text-sm font-bold text-gray-200">
                          Team Name
                        </span>

                        <input
                          name="name"
                          required
                          defaultValue={team.name}
                          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-bold text-gray-200">
                          Game
                        </span>

                        <select
                          name="game"
                          required
                          defaultValue={team.game}
                          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                        >
                          {games.map((game) => (
                            <option key={game} value={game}>
                              {game}
                            </option>
                          ))}
                        </select>
                      </label>

                      <button
                        type="submit"
                        className="w-fit rounded bg-indigo-500 px-5 py-3 font-black text-white transition hover:bg-indigo-400"
                      >
                        Save changes
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300">
                      Approved teams are locked.
                    </div>
                  )}
                </div>

                {isLeader && canEdit && (
                  <div className="border-t border-white/10 pt-6">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-gray-500">
                      Invite player
                    </p>

                    <form action={invitePlayerToTeam} className="grid gap-4">
                      <input type="hidden" name="teamId" value={team.id} />

                      <label className="grid gap-2">
                        <span className="text-sm font-bold text-gray-200">
                          Username or Discord ID
                        </span>

                        <input
                          name="player"
                          required
                          placeholder="Example: abu3day or 615..."
                          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                        />
                      </label>

                      <button
                        type="submit"
                        className="w-fit rounded bg-indigo-500 px-5 py-3 font-black text-white transition hover:bg-indigo-400"
                      >
                        Send invite
                      </button>
                    </form>
                  </div>
                )}

                {isLeader && (
                  <div className="border-t border-white/10 pt-6">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-gray-500">
                      Review
                    </p>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-bold text-gray-400">
                          Current status
                        </span>

                        <StatusBadge status={team.status} />
                      </div>

                      {canSubmitForReview && (
                        <form action={submitTeamForReview}>
                          <input type="hidden" name="teamId" value={team.id} />

                          <button
                            type="submit"
                            className="rounded bg-green-500 px-5 py-3 font-black text-white transition hover:bg-green-400"
                          >
                            Submit for review
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        {isLeader && canDelete && (
          <section className="mt-8 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-red-300">
                  Danger Zone
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  Delete team
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                  This permanently deletes the team, its members, and pending
                  invitations.
                </p>
              </div>

              <ConfirmActionForm
                action={deleteTeam}
                buttonLabel="Delete team"
                pendingLabel="Deleting..."
                title="Delete team?"
                description={`Are you sure you want to delete ${team.name}? This cannot be undone.`}
                confirmLabel="Delete permanently"
                hiddenFields={[
                  {
                    name: "teamId",
                    value: team.id,
                  },
                ]}
              />
            </div>
          </section>
        )}
      </section>

      <Footer />
    </main>
  );
}
