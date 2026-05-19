type StaffCardProps = {
  name: string;
  role: string;
  status: string;
};

function getStatusClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "available") {
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  }

  if (normalizedStatus === "busy") {
    return "border-yellow-400/25 bg-yellow-500/10 text-yellow-300";
  }

  return "border-white/10 bg-white/5 text-gray-300";
}

export default function StaffCard({ name, role, status }: StaffCardProps) {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-2xl font-black text-violet-200">
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />
        <span className="relative">{initials}</span>
      </div>

      <h2 className="text-2xl font-black text-white">{name}</h2>

      <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-violet-300">
        {role}
      </p>

      <div className="mt-4 flex justify-center">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${getStatusClasses(
            status,
          )}`}
        >
          {status}
        </span>
      </div>
    </article>
  );
}
