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
    <article className="grid gap-4 p-5 transition hover:bg-white/[0.035] md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.4fr)] md:items-center">
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
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
          Role
        </p>

        <h2 className="mt-1 text-xl font-black text-white">{name}</h2>
      </div>

      <p className="text-sm leading-6 text-gray-400">{description}</p>
    </article>
  );
}
