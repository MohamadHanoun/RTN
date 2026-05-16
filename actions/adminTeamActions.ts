"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/login");
  }

  return session.user;
}

function adminTeamsRedirect(message: string): never {
  redirect(`/admin?tab=teams&message=${encodeURIComponent(message)}`);
}

function adminTeamsError(error: string): never {
  redirect(`/admin?tab=teams&error=${encodeURIComponent(error)}`);
}

export async function approveTeam(formData: FormData) {
  await requireAdmin();

  const teamId = String(formData.get("teamId") || "").trim();

  if (!teamId) {
    adminTeamsError("Team ID is missing.");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    adminTeamsError("Team was not found.");
  }

  if (team.status === "approved") {
    adminTeamsError("Team is already approved.");
  }

  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      status: "approved",
      approvedAt: new Date(),
      rejectedAt: null,
      rejectionReason: null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/profile");

  adminTeamsRedirect("Team approved successfully.");
}

export async function rejectTeam(formData: FormData) {
  await requireAdmin();

  const teamId = String(formData.get("teamId") || "").trim();
  const rejectionReason = String(formData.get("rejectionReason") || "").trim();

  if (!teamId) {
    adminTeamsError("Team ID is missing.");
  }

  if (!rejectionReason) {
    adminTeamsError("Rejection reason is required.");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    adminTeamsError("Team was not found.");
  }

  if (team.status === "approved") {
    adminTeamsError("Approved teams cannot be rejected.");
  }

  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      status: "rejected",
      rejectedAt: new Date(),
      rejectionReason,
      approvedAt: null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/profile");

  adminTeamsRedirect("Team rejected.");
}

export async function deleteTeamAsAdmin(formData: FormData) {
  await requireAdmin();

  const teamId =
    String(formData.get("teamId") || "").trim() ||
    String(formData.get("id") || "").trim();

  if (!teamId) {
    adminTeamsError("Team ID is missing.");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    adminTeamsError("Team was not found.");
  }

  await prisma.team.delete({
    where: {
      id: team.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/profile");

  adminTeamsRedirect("Team deleted successfully.");
}
