const steps = [
  {
    number: "01",
    title: "Create a draft team",
    description:
      "Choose a team name and select the game your team will compete in.",
  },
  {
    number: "02",
    title: "Invite players",
    description:
      "Invite registered RTN players to join your team before submitting it.",
  },
  {
    number: "03",
    title: "Submit for review",
    description:
      "When your team is ready, send it to the RTN staff for approval.",
  },
  {
    number: "04",
    title: "Get approved",
    description:
      "After approval, your team becomes official and can join future tournaments.",
  },
];

export default function TeamFlowGuide() {
  return (
    <section className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
          Team System
        </p>

        <h2 className="text-3xl font-black">How team creation works</h2>

        <p className="mt-4 max-w-3xl leading-7 text-gray-300">
          Create a team, invite your players, then submit it for admin review.
          Once approved, the team becomes official inside RTN.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <article
            key={step.number}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-black text-white">
                {step.number}
              </span>

              <h3 className="text-lg font-bold">{step.title}</h3>
            </div>

            <p className="leading-7 text-gray-300">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
