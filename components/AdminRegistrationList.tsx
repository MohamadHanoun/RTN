import {
  approveRegistrationInline,
  cancelRegistrationInline,
  rejectRegistrationInline,
} from "@/actions/adminRegistrationInlineActions";
import InlineAdminRegistrationForm from "@/components/InlineAdminRegistrationForm";
import ProfileNotice from "@/components/ProfileNotice";
import { prisma } from "@/lib/prisma";

type AdminRegistrationListProps = {
  message?: string;
  error?: string;
};

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const styles: Record<string, string> = {
    registered: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    approved: "border-green-500/20 bg-green-500/10 text-green-300",
    rejected: "border-red-500/20 bg-red-500/10 text-red-300",
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

function RoleBadge({ leader }: { leader: boolean }) {
  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${
        leader
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
      }`}
    >
      {leader ? "Leader" : "Member"}
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

function formatDate(date: Date | null) {
  if (!date) {
    return "Not reviewed";
  }

  return date.toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminRegistrationList({
  message,
  error,
}: AdminRegistrationListProps) {
  const registrations = await prisma.tournamentRegistration.findMany({
    include: {
      tournament: true,
      registeredBy: true,
      team: {
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const priority: Record<string, number> = {
    registered: 0,
    approved: 1,
    rejected: 2,
    cancelled: 3,
  };

  const sortedRegistrations = registrations.sort((a, b) => {
    const statusA = priority[a.status] ?? 10;
    const statusB = priority[b.status] ?? 10;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const pendingCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;

  const approvedCount = registrations.filter(
    (registration) => registration.status === "approved",
  ).length;

  const rejectedCount = registrations.filter(
    (registration) => registration.status === "rejected",
  ).length;

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16">
      <ProfileNotice message={message} error={error} />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
            Registrations
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Tournament registrations
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Review team registrations, approve valid teams, reject with a clear
            reason, or cancel a registration when needed.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total" value={registrations.length} />
          <StatCard label="Pending" value={pendingCount} />
          <StatCard label="Approved" value={approvedCount} />
          <StatCard label="Rejected" value={rejectedCount} />
        </div>
      </div>

      {sortedRegistrations.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
          No tournament registrations found.
        </section>
      ) : (
        <section className="grid gap-5">
          {sortedRegistrations.map((registration) => {
            const isPending = registration.status === "registered";
            const canApprove = registration.status !== "approved";
            const canReject = registration.status !== "rejected";
            const canCancel = registration.status !== "cancelled";

            return (
              <article
                key={registration.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                <div className="border-b border-white/10 bg-white/[0.03] p-5">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-white">
                          {registration.team.name}
                        </h2>

                        <StatusBadge status={registration.status} />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {registration.tournament.title} ·{" "}
                        {registration.tournament.game}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="Team size"
                        value={registration.team.members.length}
                      />
                      <StatCard
                        label="Slots"
                        value={registration.tournament.maxSlots}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_230px] xl:items-start">
                  <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
                      Registration info
                    </p>

                    <div className="mt-4 grid gap-3 text-sm text-gray-300">
                      <p>
                        Registered by:{" "}
                        <span className="font-black text-white">
                          {registration.registeredBy.username}
                        </span>
                      </p>

                      <p>
                        Registered at:{" "}
                        <span className="font-black text-white">
                          {formatDate(registration.createdAt)}
                        </span>
                      </p>

                      <p>
                        Reviewed at:{" "}
                        <span className="font-black text-white">
                          {formatDate(registration.reviewedAt)}
                        </span>
                      </p>

                      <p>
                        Tournament date:{" "}
                        <span className="font-black text-white">
                          {registration.tournament.date}
                        </span>
                      </p>
                    </div>

                    {registration.rejectionReason && (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="font-black text-red-300">
                          Rejection reason
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-300">
                          {registration.rejectionReason}
                        </p>
                      </div>
                    )}
                  </section>

                  <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
                      Team players
                    </p>

                    <div className="mt-4 grid gap-2">
                      {registration.team.members.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-400">
                          No players in this team.
                        </div>
                      ) : (
                        registration.team.members.map((member) => {
                          const isLeader =
                            member.userId === registration.team.leaderId;

                          return (
                            <div
                              key={member.id}
                              className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
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
                    <section className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
                        Review actions
                      </p>

                      <div className="mt-3 grid gap-2">
                        {canApprove ? (
                          <InlineAdminRegistrationForm
                            action={approveRegistrationInline}
                            buttonLabel={
                              isPending ? "Approve registration" : "Approve"
                            }
                            pendingLabel="Approving..."
                            variant="success"
                          >
                            <input
                              type="hidden"
                              name="registrationId"
                              value={registration.id}
                            />
                          </InlineAdminRegistrationForm>
                        ) : (
                          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-black text-green-300">
                            Approved
                          </div>
                        )}

                        {canReject && (
                          <InlineAdminRegistrationForm
                            action={rejectRegistrationInline}
                            buttonLabel={
                              isPending ? "Reject registration" : "Reject"
                            }
                            pendingLabel="Rejecting..."
                            variant="danger"
                            confirmTitle="Reject registration?"
                            confirmDescription={`Write a clear reason for rejecting ${registration.team.name} from ${registration.tournament.title}. The player will see this reason.`}
                            confirmLabel="Reject registration"
                            textareaName="rejectionReason"
                            textareaLabel="Rejection reason"
                            textareaPlaceholder="Example: Team does not meet requirements, wrong roster, missing players..."
                            textareaRequired
                          >
                            <input
                              type="hidden"
                              name="registrationId"
                              value={registration.id}
                            />
                          </InlineAdminRegistrationForm>
                        )}
                      </div>
                    </section>

                    {canCancel && (
                      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">
                          Danger zone
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          Cancel this registration without deleting the team.
                        </p>

                        <div className="mt-3">
                          <InlineAdminRegistrationForm
                            action={cancelRegistrationInline}
                            buttonLabel="Cancel registration"
                            pendingLabel="Cancelling..."
                            variant="secondary"
                            confirmTitle="Cancel registration?"
                            confirmDescription={`Cancel ${registration.team.name}'s registration for ${registration.tournament.title}?`}
                            confirmLabel="Cancel registration"
                          >
                            <input
                              type="hidden"
                              name="registrationId"
                              value={registration.id}
                            />
                          </InlineAdminRegistrationForm>
                        </div>
                      </section>
                    )}
                  </aside>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}
