import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import RuleCard from "@/components/RuleCard";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getRules() {
  return prisma.rule.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export default async function RulesPage() {
  const rules = await getRules();

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <PageHeader
        label="RTN Rules"
        title="Keep the community fair, friendly, and fun."
        description="These rules are loaded from the database and can be managed from the RTN admin panel."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-indigo-300">
            Rules Management Active
          </h2>

          <p className="leading-7 text-gray-300">
            RTN admins can now add, hide, delete, and reorder rules from the
            admin panel. Only active rules are shown here.
          </p>
        </div>

        {rules.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">No active rules yet</h2>

            <p className="text-gray-300">
              Active rules will appear here after they are created from the
              admin panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {rules.map((rule, index) => (
              <RuleCard key={rule.id} rule={rule.text} index={index} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}