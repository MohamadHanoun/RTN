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
    <article className="grid gap-4 p-5 transition hover:bg-white/[0.035] md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_130px] md:items-center">
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-sm font-black text-violet-200">
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />
        <span className="relative">{initials}</span>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
          Name
        </p>

        <h2 className="mt-1 text-xl font-black text-white">{name}</h2>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
          Role
        </p>

        <p className="mt-1 text-sm font-black text-violet-300">{role}</p>
      </div>

      <span
        className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${getStatusClasses(
          status,
        )}`}
      >
        {status}
      </span>
    </article>
  );
}
