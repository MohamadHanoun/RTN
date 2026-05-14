type StaffCardProps = {
  name: string;
  role: string;
  status: string;
};

export default function StaffCard({ name, role, status }: StaffCardProps) {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-3xl font-black shadow-lg shadow-indigo-500/20">
        {initials}
      </div>

      <h2 className="mb-2 text-2xl font-bold">{name}</h2>

      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
        {role}
      </p>

      <p className="leading-7 text-gray-400">{status}</p>
    </article>
  );
}