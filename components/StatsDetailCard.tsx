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
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-black text-white">{value}</h2>

      <p className="mt-4 text-sm leading-6 text-gray-400">{description}</p>
    </article>
  );
}
