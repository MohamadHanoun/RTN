type RoleCardProps = {
  name: string;
  color: string;
  description: string;
};

function normalizeColor(color: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return "#8b5cf6";
}

export default function RoleCard({ name, color, description }: RoleCardProps) {
  const roleColor = normalizeColor(color);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-2xl border border-white/10 bg-black/30 p-2">
          <div
            className="h-full w-full rounded-xl shadow-lg"
            style={{
              backgroundColor: roleColor,
              boxShadow: `0 0 24px ${roleColor}55`,
            }}
          />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
            Ascendra role
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">{name}</h2>
        </div>
      </div>

      <p className="text-sm leading-6 text-gray-400">{description}</p>
    </article>
  );
}
