import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RoleCard from "@/components/RoleCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Roles | Ascendra",
  description: "Ascendra community roles.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getRoles() {
  return prisma.role.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16)_0%,transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#0b0d17_45%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1680px] px-6 py-14 lg:px-10 2xl:px-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Community
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-6xl">
              Roles
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Public community roles and responsibilities.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-8 px-6 py-10 lg:px-10 2xl:px-14">
          {roles.length === 0 ? (
            <EmptyState
              title="No active roles yet"
              description="Roles will appear here when they are published."
            />
          ) : (
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
              <div className="hidden border-b border-white/10 bg-black/25 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 md:grid md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.4fr)]">
                <span>Color</span>
                <span>Role</span>
                <span>Description</span>
              </div>

              <div className="divide-y divide-white/10">
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    name={role.name}
                    color={role.color}
                    description={role.description}
                  />
                ))}
              </div>
            </section>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
