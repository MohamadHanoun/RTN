import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StaffCard from "@/components/StaffCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Staff | Ascendra",
  description: "Ascendra staff members.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getStaffMembers() {
  return prisma.staffMember.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export default async function StaffPage() {
  const staffMembers = await getStaffMembers();

  return (
    <main className="min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16)_0%,transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12)_0%,transparent_30%),linear-gradient(to_bottom,#070811,#090b15_42%,#070811)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="relative min-h-[430px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/images/backgrounds/community-hero.webp")',
            }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,17,0.90)_0%,rgba(7,8,17,0.62)_44%,rgba(7,8,17,0.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#070811]/75 to-[#070811]" />

          <div className="relative z-10 mx-auto max-w-[1680px] px-6 pb-28 pt-20 lg:px-10 2xl:px-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Community
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              Staff
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
              People helping manage the platform and community.
            </p>
          </div>
        </section>

        <section className="relative -mt-16 mx-auto grid max-w-[1680px] gap-8 px-6 pb-16 lg:px-10 2xl:px-14">
          {staffMembers.length === 0 ? (
            <EmptyState
              title="No active staff yet"
              description="Staff members will appear here when they are published."
            />
          ) : (
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur">
              <div className="hidden bg-white/[0.03] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-gray-500 md:grid md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_130px]">
                <span>Avatar</span>
                <span>Name</span>
                <span>Role</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-white/10">
                {staffMembers.map((member) => (
                  <StaffCard
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    status={member.status}
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
