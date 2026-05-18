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
      className={`inline-flex w-fit rounded border px-3 py-1 text-xs font-bold capitalize ${
        styles[normalizedStatus] || "border-white/10 bg-white/5 text-gray-300"
      }`}
    >
      {status}
    </span>
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

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16">
      <ProfileNotice message={message} error={error} />

      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
          Registrations
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Tournament registrations
        </h1>

        <p className="mt-3 max-w-3xl text-gray-400">
          Review team registrations for tournaments. Approve valid
          registrations, reject with a clear reason, or cancel when needed.
        </p>
      </div>

      {sortedRegistrations.length === 0 ? (
        <section className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
          No tournament registrations found.
        </section>
      ) : (
        <section className="grid gap-4">
          {sortedRegistrations.map((registration) => {
            const canApprove = registration.status !== "approved";
            const canReject = registration.status !== "rejected";
            const canCancel = registration.status !== "cancelled";

            return (
              <article
                key={registration.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <div className="grid gap-6 p-5 xl:grid-cols-[1fr_1.1fr_260px] xl:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-white">
                        {registration.team.name}
                      </h2>

                      <StatusBadge status={registration.status} />
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-gray-400">
                      <p>
                        Tournament:{" "}
                        <span className="font-bold text-white">
                          {registration.tournament.title}
                        </span>
                      </p>

                      <p>
                        Game:{" "}
                        <span className="font-bold text-white">
                          {registration.tournament.game}
                        </span>
                      </p>

                      <p>
                        Registered by:{" "}
                        <span className="font-bold text-white">
                          {registration.registeredBy.username}
                        </span>
                      </p>

                      <p>
                        Registered at:{" "}
                        <span className="font-bold text-white">
                          {formatDate(registration.createdAt)}
                        </span>
                      </p>

                      <p>
                        Reviewed at:{" "}
                        <span className="font-bold text-white">
                          {formatDate(registration.reviewedAt)}
                        </span>
                      </p>
                    </div>

                    {registration.rejectionReason && (
                      <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="font-black text-red-300">
                          Rejection reason
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-300">
                          {registration.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                      Team players
                    </p>

                    <div className="grid gap-2">
                      {registration.team.members.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-400">
                          No players in this team.
                        </div>
                      ) : (
                        registration.team.members.map((member) => {
                          const isLeader =
                            member.userId === registration.team.leaderId;

                          return (
                            <div
                              key={member.id}
                              className="grid gap-2 rounded-lg border border-white/10 bg-black/20 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                              <div>
                                <p className="font-black text-white">
                                  {member.user.username}
                                </p>

                                <p className="mt-1 break-all text-xs text-gray-500">
                                  {member.user.discordId}
                                </p>
                              </div>

                              <span
                                className={`w-fit rounded border px-2.5 py-1 text-xs font-bold ${
                                  isLeader
                                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                                    : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                                }`}
                              >
                                {isLeader ? "Leader" : "Member"}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2 xl:justify-end">
                    {canApprove ? (
                      <InlineAdminRegistrationForm
                        action={approveRegistrationInline}
                        buttonLabel="Approve"
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
                      <div className="rounded border border-green-500/20 bg-green-500/10 px-4 py-2 text-center text-sm font-black text-green-300">
                        Approved
                      </div>
                    )}

                    {canReject && (
                      <InlineAdminRegistrationForm
                        action={rejectRegistrationInline}
                        buttonLabel="Reject"
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

                    {canCancel && (
                      <InlineAdminRegistrationForm
                        action={cancelRegistrationInline}
                        buttonLabel="Cancel"
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
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}
