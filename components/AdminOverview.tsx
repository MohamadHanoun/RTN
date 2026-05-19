type AdminOverviewItem = {
  label: string;
  value: string;
  description: string;
};

type AdminOverviewProps = {
  items: AdminOverviewItem[];
};

function getAccentClass(index: number) {
  const accents = [
    "border-violet-400/25 bg-violet-500/10 text-violet-200",
    "border-cyan-400/25 bg-cyan-500/10 text-cyan-300",
    "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    "border-yellow-400/25 bg-yellow-500/10 text-yellow-300",
    "border-red-400/25 bg-red-500/10 text-red-300",
  ];

  return accents[index % accents.length];
}

function getPanelClass(index: number) {
  const panels = [
    "hover:border-violet-400/30",
    "hover:border-cyan-400/30",
    "hover:border-emerald-400/30",
    "hover:border-yellow-400/30",
    "hover:border-red-400/30",
  ];

  return panels[index % panels.length];
}

export default function AdminOverview({ items }: AdminOverviewProps) {
  const mainItems = items.slice(0, 3);
  const secondaryItems = items.slice(3);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Overview
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Admin dashboard overview
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            A quick summary of Ascendra content, tournaments, teams,
            registrations, and player activity.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
            Overview cards
          </p>

          <p className="mt-1 text-2xl font-black text-white">{items.length}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {mainItems.map((item, index) => (
          <article
            key={item.label}
            className={`rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/[0.06] ${getPanelClass(
              index,
            )}`}
          >
            <div
              className={`mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${getAccentClass(
                index,
              )}`}
            >
              {item.label}
            </div>

            <h3 className="text-4xl font-black text-white">{item.value}</h3>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {secondaryItems.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {secondaryItems.map((item, index) => {
            const itemIndex = index + mainItems.length;

            return (
              <article
                key={item.label}
                className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/[0.06] ${getPanelClass(
                  itemIndex,
                )}`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div
                      className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${getAccentClass(
                        itemIndex,
                      )}`}
                    >
                      {item.label}
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  <p className="text-4xl font-black text-white">{item.value}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
