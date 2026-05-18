import {
  deleteTournamentResultInline,
  saveTournamentResultInline,
} from "@/actions/adminTournamentResultActions";
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

function inputClass() {
  return "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-gray-200">{children}</span>;
}

function PointsPresetCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
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

  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-5">
      <div className="grid gap-5">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
              Tournament results
            </p>

            <h4 className="mt-2 text-xl font-black text-white">
              Award tournament points
            </h4>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Add or update final team results. Every player in the selected
              team receives the same tournament points.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 xl:w-[300px]">
            <PointsPresetCard label="1st" value="10 pts" />
            <PointsPresetCard label="2nd" value="7 pts" />
            <PointsPresetCard label="3rd" value="5 pts" />
          </div>
        </div>

        {eligibleRegistrations.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-400">
            No eligible teams yet. Register or approve teams before adding
            results.
          </div>
        ) : (
          <InlineAdminTournamentForm
            action={saveTournamentResultInline}
            buttonLabel="Save result"
            pendingLabel="Saving result..."
            variant="success"
            className="grid gap-4"
          >
            <input type="hidden" name="tournamentId" value={tournamentId} />

            <label className="grid gap-2">
              <FieldLabel>Team</FieldLabel>

              <select
                name="teamId"
                required
                defaultValue=""
                className={inputClass()}
              >
                <option value="" disabled>
                  Select team
                </option>

                {eligibleRegistrations.map((registration) => (
                  <option key={registration.id} value={registration.teamId}>
                    {registration.team.name} · {registration.status}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel>Placement</FieldLabel>

                <input
                  name="placement"
                  type="number"
                  min="1"
                  required
                  placeholder="1"
                  className={inputClass()}
                />
              </label>

              <label className="grid gap-2">
                <FieldLabel>Points</FieldLabel>

                <input
                  name="points"
                  type="number"
                  min="0"
                  required
                  placeholder="10"
                  className={inputClass()}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <FieldLabel>Note</FieldLabel>

              <input
                name="note"
                placeholder="Optional note, example: Winner, second place, participation..."
                className={inputClass()}
              />
            </label>
          </InlineAdminTournamentForm>
        )}

        {results.length > 0 && (
          <div className="grid gap-3 border-t border-white/10 pt-5">
            {results.map((result) => (
              <div
                key={result.id}
                className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 lg:grid-cols-[minmax(0,1fr)_90px_100px_160px] lg:items-center"
              >
                <div>
                  <p className="font-black text-white">{result.team.name}</p>

                  {result.note && (
                    <p className="mt-1 text-sm text-gray-400">{result.note}</p>
                  )}
                </div>

                <p className="text-sm font-black text-gray-300">
                  #{result.placement}
                </p>

                <p className="text-sm font-black text-green-300">
                  {result.points} pts
                </p>

                <InlineAdminTournamentForm
                  action={deleteTournamentResultInline}
                  buttonLabel="Delete result"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
