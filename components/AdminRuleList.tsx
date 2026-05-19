import AdminRuleDragList from "@/components/AdminRuleDragList";
import { prisma } from "@/lib/prisma";

export default async function AdminRuleList() {
  const rules = await prisma.rule.findMany({
    select: {
      id: true,
      text: true,
      order: true,
      isActive: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const activeRules = rules.filter((rule) => rule.isActive).length;
  const hiddenRules = rules.length - activeRules;

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-300">
            Manage rules
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">Rules list</h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Edit rules, reorder them by dragging, change visibility, or delete
            rules with confirmation.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {rules.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
              Active
            </p>
            <p className="mt-1 text-2xl font-black text-white">{activeRules}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
              Hidden
            </p>
            <p className="mt-1 text-2xl font-black text-white">{hiddenRules}</p>
          </div>
        </div>
      </div>

      <AdminRuleDragList initialRules={rules} />
    </section>
  );
}
