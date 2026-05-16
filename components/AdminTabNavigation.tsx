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
    description: "Summary",
  },
  {
    label: "Announcements",
    value: "announcements",
    description: "News",
  },
  {
    label: "Tournaments",
    value: "tournaments",
    description: "Events",
  },
  {
    label: "Rules",
    value: "rules",
    description: "Rules",
  },
  {
    label: "Roles",
    value: "roles",
    description: "Roles",
  },
  {
    label: "Staff",
    value: "staff",
    description: "Team",
  },
  {
    label: "Modules",
    value: "modules",
    description: "Tools",
  },
  {
    label: "Teams",
    value: "teams",
    description: "Review",
  },
];

export default function AdminTabNavigation({
  activeTab,
}: AdminTabNavigationProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-indigo-500/5">
        <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <Link
                key={tab.value}
                href={`/admin?tab=${tab.value}`}
                className={`min-w-[150px] rounded-2xl border p-4 transition lg:min-w-0 ${
                  isActive
                    ? "border-indigo-400/40 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10"
                    : "border-white/10 bg-black/20 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                <p className="font-bold">{tab.label}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {tab.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}