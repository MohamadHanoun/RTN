"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  acceptProfileInvitationInline,
  rejectProfileInvitationInline,
  type ProfileInvitationActionResult,
} from "@/actions/profileInvitationInlineActions";

type ProfileInvitation = {
  id: string;
  status: string;
  createdAt: string | Date;
  team: {
    id: string;
    name: string;
    game: string;
    leader?: {
      username: string;
    } | null;
  };
  invitedBy?: {
    username: string;
  } | null;
};

type ProfileInvitationsPanelProps = {
  invitations?: ProfileInvitation[];
  receivedInvitations?: ProfileInvitation[];
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ActionNotice({
  result,
}: {
  result: ProfileInvitationActionResult | null;
}) {
  if (!result) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-bold ${
        result.ok
          ? "border-green-500/20 bg-green-500/10 text-green-300"
          : "border-red-500/20 bg-red-500/10 text-red-300"
      }`}
    >
      {result.message}
    </div>
  );
}

function InvitationActionForm({
  inviteId,
  actionType,
  teamName,
}: {
  inviteId: string;
  actionType: "accept" | "reject";
  teamName: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<ProfileInvitationActionResult | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isReject = actionType === "reject";

  function runAction() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      const result = isReject
        ? await rejectProfileInvitationInline(formData)
        : await acceptProfileInvitationInline(formData);

      setNotice(result);
      setConfirmOpen(false);

      if (result.redirectTo) {
        router.push(result.redirectTo);
        return;
      }

      if (result.ok) {
        window.setTimeout(() => {
          router.refresh();
        }, 450);
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isReject) {
      setConfirmOpen(true);
      return;
    }

    runAction();
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-2">
        <input type="hidden" name="inviteId" value={inviteId} />

        <button
          type="submit"
          disabled={pending}
          className={
            isReject
              ? "rounded border border-red-500/25 px-4 py-2 text-sm font-black text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              : "rounded bg-green-500 px-4 py-2 text-sm font-black text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          {pending
            ? isReject
              ? "Rejecting..."
              : "Accepting..."
            : isReject
              ? "Reject"
              : "Accept"}
        </button>

        <ActionNotice result={notice} />
      </form>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
                Confirmation
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Reject invitation?
              </h2>

              <p className="mt-2 leading-7 text-gray-300">
                Are you sure you want to reject the invitation from {teamName}?
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3 p-6">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded border border-white/10 px-5 py-3 text-sm font-black text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Keep invitation
              </button>

              <button
                type="button"
                onClick={runAction}
                disabled={pending}
                className="rounded bg-red-500 px-5 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Rejecting..." : "Reject invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProfileInvitationsPanel({
  invitations,
  receivedInvitations,
}: ProfileInvitationsPanelProps) {
  const pendingInvitations = (invitations || receivedInvitations || []).filter(
    (invite) => invite.status === "pending",
  );

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
          Invitations
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Team invitations
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Accept or reject team invitations sent by team leaders.
        </p>
      </div>

      {pendingInvitations.length === 0 ? (
        <div className="p-6 text-gray-300">No pending invitations.</div>
      ) : (
        <div className="divide-y divide-white/10">
          {pendingInvitations.map((invite) => (
            <article key={invite.id} className="grid gap-5 p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {invite.team.name}
                    </h3>

                    <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      {invite.team.game}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-gray-400">
                    <p>
                      Invited by:{" "}
                      <span className="font-bold text-white">
                        {invite.invitedBy?.username || "Unknown"}
                      </span>
                    </p>

                    <p>
                      Team leader:{" "}
                      <span className="font-bold text-white">
                        {invite.team.leader?.username || "Unknown"}
                      </span>
                    </p>

                    <p>
                      Sent at:{" "}
                      <span className="font-bold text-white">
                        {formatDate(invite.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  Pending
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:max-w-sm">
                <InvitationActionForm
                  inviteId={invite.id}
                  actionType="accept"
                  teamName={invite.team.name}
                />

                <InvitationActionForm
                  inviteId={invite.id}
                  actionType="reject"
                  teamName={invite.team.name}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export { ProfileInvitationsPanel };
export default ProfileInvitationsPanel;
