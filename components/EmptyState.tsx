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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
        <span className="text-2xl text-indigo-300">RTN</span>
      </div>

      <h2 className="mb-3 text-2xl font-bold">{title}</h2>

      <p className="mx-auto max-w-xl leading-7 text-gray-300">
        {description}
      </p>

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="mt-7 inline-block rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white transition hover:bg-indigo-400"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}