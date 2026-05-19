type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-black/20">
      <div className="relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/10">
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />
        <span className="relative text-xl font-black text-violet-200">A</span>
      </div>

      <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-violet-300">
        Empty state
      </p>

      <h2 className="mb-3 text-2xl font-black text-white">{title}</h2>

      <p className="mx-auto max-w-xl leading-7 text-gray-300">{description}</p>

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="mt-7 inline-block rounded-xl bg-violet-600 px-6 py-3 font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
