import Link from "next/link";

type AdminTab = {
  label: string;
  value: string;
  description: string;
};

type AdminTabNavigationProps = {
  activeTab: string;
};

const tabs: AdminTab[] = [
  {
    label: "Overview",
    value: "overview",
    description: "Dashboard summary and quick admin insights.",
  },
  {
    label: "Announcements",
    value: "announcements",
    description: "Create and manage community announcements.",
  },
  {
    label: "Tournaments",
    value: "tournaments",
    description: "Create tournaments and control registration settings.",
  },
  {
    label: "Registrations",
    value: "registrations",
    description: "Review tournament team registrations.",
  },
  {
    label: "Teams",
    value: "teams",
    description: "View team leaders, members, and registration history.",
  },
  {
    label: "Players",
    value: "players",
    description: "View Discord player accounts and team activity.",
  },
  {
    label: "Rules",
    value: "rules",
    description: "Manage community rules and ordering.",
  },
  {
    label: "Roles",
    value: "roles",
    description: "Manage public role information and ordering.",
  },
  {
    label: "Staff",
    value: "staff",
    description: "Manage public staff members and visibility.",
  },
  {
    label: "Modules",
    value: "modules",
    description: "View RTN admin tools and future modules.",
  },
];

export default function AdminTabNavigation({
  activeTab,
}: AdminTabNavigationProps) {
  const activeTabData = tabs.find((tab) => tab.value === activeTab) || tabs[0];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-indigo-500/5">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Admin sections
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Switch between RTN management tools.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
              Current section
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {activeTabData.label}
            </p>
          </div>
        </div>

        <div className="p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <Link
                  key={tab.value}
                  href={`/admin?tab=${tab.value}`}
                  title={tab.description}
                  className={`group relative whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-black transition ${
                    isActive
                      ? "border-indigo-400/40 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
                      : "border-white/10 bg-black/20 text-gray-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}

                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-sm leading-6 text-gray-400">
              <span className="font-black text-white">
                {activeTabData.label}:
              </span>{" "}
              {activeTabData.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
