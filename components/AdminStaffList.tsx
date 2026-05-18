import AdminStaffDragList from "@/components/AdminStaffDragList";
import { prisma } from "@/lib/prisma";

export default async function AdminStaffList() {
  const staffMembers = await prisma.staffMember.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      status: true,
      order: true,
      isActive: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
            Manage Staff
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">Staff list</h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Edit staff members, reorder them by dragging, update status, show or
            hide members, and delete staff records with confirmation.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">
            Total staff
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {staffMembers.length}
          </p>
        </div>
      </div>

      <AdminStaffDragList initialStaffMembers={staffMembers} />
    </section>
  );
}
