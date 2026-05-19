type RuleCardProps = {
  rule: string;
  index: number;
};

export default function RuleCard({ rule, index }: RuleCardProps) {
  return (
    <article className="grid gap-4 p-5 transition hover:bg-white/[0.035] md:grid-cols-[90px_minmax(0,1fr)] md:items-start">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-lg font-black text-violet-200">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
          Rule {index + 1}
        </p>

        <p className="mt-2 text-base leading-7 text-gray-300">{rule}</p>
      </div>
    </article>
  );
}
