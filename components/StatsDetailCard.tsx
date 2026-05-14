type StatsDetailCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function StatsDetailCard({
  title,
  value,
  description,
}: StatsDetailCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
        {title}
      </p>

      <h2 className="mb-4 text-3xl font-black">{value}</h2>

      <p className="leading-7 text-gray-300">{description}</p>
    </article>
  );
}