type AdminOverviewItem = {
  label: string;
  value: string;
  description: string;
};

type AdminOverviewProps = {
  items: AdminOverviewItem[];
};

export default function AdminOverview({ items }: AdminOverviewProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              {item.label}
            </p>

            <h2 className="mb-3 text-3xl font-black">{item.value}</h2>

            <p className="leading-7 text-gray-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}