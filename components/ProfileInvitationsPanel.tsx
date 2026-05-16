import { respondToTeamInvite } from "@/actions/teamActions";

type ProfileInvitationsPanelProps = {
  invites: {
    id: string;
    team?: {
      name: string;
      game: string;
      status: string;
    } | null;
    invitedBy?: {
      username: string;
    } | null;
  }[];
};

export default function ProfileInvitationsPanel({
  invites,
}: ProfileInvitationsPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">Team Invitations</p>
          <p className="mt-1 text-xs text-gray-400">
            {invites.length > 0
              ? `${invites.length} pending invitation${
                  invites.length === 1 ? "" : "s"
                }`
              : "No pending invitations"}
          </p>
        </div>

        {invites.length > 0 && (
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
            {invites.length}
          </span>
        )}
      </div>

      {invites.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-gray-300">
          Team invitations will appear here when another player invites you.
        </p>
      ) : (
        <div className="grid gap-3">
          {invites.map((invite) => {
            if (!invite.team) {
              return (
                <div
                  key={invite.id}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-3"
                >
                  <p className="text-sm font-bold text-red-300">
                    Invitation unavailable
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-300">
                    This team may have been deleted.
                  </p>
                </div>
              );
            }

            const isLocked =
              invite.team.status === "pending" ||
              invite.team.status === "approved";

            return (
              <article
                key={invite.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="mb-3">
                  <p className="font-bold text-white">{invite.team.name}</p>

                  <p className="mt-1 text-sm text-gray-300">
                    {invite.team.game} • Invited by{" "}
                    {invite.invitedBy?.username || "Unknown"}
                  </p>
                </div>

                {isLocked ? (
                  <p className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2 text-xs leading-5 text-yellow-200">
                    This team is already submitted or approved.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <form action={respondToTeamInvite}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <input type="hidden" name="response" value="accepted" />

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-green-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-green-400"
                      >
                        Accept
                      </button>
                    </form>

                    <form action={respondToTeamInvite}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <input type="hidden" name="response" value="rejected" />

                      <button
                        type="submit"
                        className="w-full rounded-lg border border-red-500/20 px-3 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
