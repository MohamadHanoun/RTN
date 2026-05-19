type RuleCardProps = {
  rule: string;
  index: number;
};

export default function RuleCard({ rule, index }: RuleCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div className="mb-5 flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-xl font-black text-violet-200">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
            Community rule
          </p>

          <h2 className="mt-1 text-xl font-black text-white">
            Rule {index + 1}
          </h2>
        </div>
      </div>

      <p className="text-sm leading-6 text-gray-400">{rule}</p>
    </article>
  );
}
