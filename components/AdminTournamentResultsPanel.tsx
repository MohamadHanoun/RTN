import { deleteTournamentResultInline } from "@/actions/adminTournamentResultActions";
import AdminTournamentResultForm from "@/components/AdminTournamentResultForm";
import InlineAdminTournamentForm from "@/components/InlineAdminTournamentForm";

type TournamentRegistrationItem = {
  id: string;
  status: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    game: string;
  };
};

type TournamentResultItem = {
  id: string;
  teamId: string;
  placement: number;
  points: number;
  note: string | null;
  team: {
    name: string;
  };
};

type AdminTournamentResultsPanelProps = {
  tournamentId: string;
  tournamentTitle: string;
  registrations: TournamentRegistrationItem[];
  results: TournamentResultItem[];
};

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function PointsPresetCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-emerald-400/25 bg-emerald-500/10"
          : "border-white/10 bg-black/25"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.14em] ${
          highlight ? "text-emerald-300" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function PlacementBadge({ placement }: { placement: number }) {
  const isTopThree = placement <= 3;

  return (
    <span
      className={`grid h-11 w-11 place-items-center rounded-2xl border text-lg font-black ${
        isTopThree
          ? "border-yellow-400/25 bg-yellow-500/10 text-yellow-300"
          : "border-violet-400/25 bg-violet-500/10 text-violet-200"
      }`}
    >
      #{placement}
    </span>
  );
}

export default function AdminTournamentResultsPanel({
  tournamentId,
  tournamentTitle,
  registrations,
  results,
}: AdminTournamentResultsPanelProps) {
  const eligibleRegistrations = registrations.filter((registration) =>
    ["registered", "approved"].includes(registration.status),
  );

  const totalPoints = results.reduce(
    (total, result) => total + result.points,
    0,
  );

  const bestPlacement =
    results.length > 0
      ? Math.min(...results.map((result) => result.placement))
      : null;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/25">
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
          Results
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Tournament points
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
          Add final standings and award points to every player in the selected
          team.
        </p>
      </div>

      <div className="grid gap-5 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Eligible teams"
            value={eligibleRegistrations.length}
          />
          <SummaryCard label="Saved results" value={results.length} />
          <SummaryCard label="Awarded points" value={totalPoints} />
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                Points presets
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Use the buttons in the form to fill placement and points
                quickly.
              </p>
            </div>

            <p className="text-sm font-black text-yellow-300">
              Best: {bestPlacement ? `#${bestPlacement}` : "-"}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <PointsPresetCard label="1st place" value="10 pts" highlight />
            <PointsPresetCard label="2nd place" value="7 pts" />
            <PointsPresetCard label="3rd place" value="5 pts" />
            <PointsPresetCard label="Participation" value="1 pt" />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          {eligibleRegistrations.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-gray-400">
              No eligible teams yet. Register or approve teams before adding
              results.
            </div>
          ) : (
            <AdminTournamentResultForm
              tournamentId={tournamentId}
              registrations={eligibleRegistrations}
            />
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
              Saved results
            </p>
          </div>

          {results.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">
              No tournament results saved yet.
            </div>
          ) : (
            <div className="grid gap-3 p-4">
              {results.map((result) => (
                <article
                  key={result.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-black/25 p-4 lg:grid-cols-[70px_minmax(0,1fr)_100px_140px] lg:items-center"
                >
                  <PlacementBadge placement={result.placement} />

                  <div>
                    <p className="font-black text-white">{result.team.name}</p>

                    {result.note && (
                      <p className="mt-1 text-sm text-gray-400">
                        {result.note}
                      </p>
                    )}
                  </div>

                  <p className="text-sm font-black text-emerald-300">
                    {result.points} pts
                  </p>

                  <InlineAdminTournamentForm
                    action={deleteTournamentResultInline}
                    buttonLabel="Delete"
                    pendingLabel="Deleting..."
                    variant="danger"
                    className="grid gap-2"
                    confirmTitle="Delete tournament result?"
                    confirmDescription={`Delete ${result.team.name}'s result from ${tournamentTitle}?`}
                    confirmLabel="Delete result"
                  >
                    <input type="hidden" name="resultId" value={result.id} />
                    <input
                      type="hidden"
                      name="tournamentId"
                      value={tournamentId}
                    />
                  </InlineAdminTournamentForm>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
