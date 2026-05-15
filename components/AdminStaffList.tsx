import {
  deleteStaffMember,
  reorderStaffMembers,
  toggleStaffMemberActive,
  updateStaffMember,
} from "@/actions/staffActions";
import AdminStaffListClient from "@/components/AdminStaffListClient";
import { prisma } from "@/lib/prisma";

async function getStaffMembers() {
  return prisma.staffMember.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export default async function AdminStaffList() {
  const staffMembers = await getStaffMembers();

  return (
    <AdminStaffListClient
      staffMembers={staffMembers}
      updateStaffMember={updateStaffMember}
      toggleStaffMemberActive={toggleStaffMemberActive}
      deleteStaffMember={deleteStaffMember}
      reorderStaffMembers={reorderStaffMembers}
    />
  );
}