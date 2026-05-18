type AdminModuleCardProps = {
  title: string;
  description: string;
  status: string;
};

function getStatusClasses(status: string) {
  if (status === "Ready") {
    return {
      badge: "border-green-500/20 bg-green-500/10 text-green-300",
      panel: "border-green-500/10 bg-green-500/5",
      dot: "bg-green-300",
      message: "Available in the admin dashboard.",
    };
  }

  if (status === "Future") {
    return {
      badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
      panel: "border-cyan-500/10 bg-cyan-500/5",
      dot: "bg-cyan-300",
      message: "Planned for a later development phase.",
    };
  }

  if (status === "Important") {
    return {
      badge: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
      panel: "border-yellow-500/10 bg-yellow-500/5",
      dot: "bg-yellow-300",
      message: "High-priority RTN admin module.",
    };
  }

  return {
    badge: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    panel: "border-indigo-500/10 bg-indigo-500/5",
    dot: "bg-indigo-300",
    message: "Part of the RTN admin roadmap.",
  };
}

export default function AdminModuleCard({
  title,
  description,
  status,
}: AdminModuleCardProps) {
  const statusClasses = getStatusClasses(status);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.06]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusClasses.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusClasses.dot}`} />
          {status}
        </span>
      </div>

      <div
        className={`mt-auto rounded-xl border px-4 py-3 ${statusClasses.panel}`}
      >
        <p className="text-sm leading-6 text-gray-300">
          {statusClasses.message}
        </p>
      </div>
    </article>
  );
}
