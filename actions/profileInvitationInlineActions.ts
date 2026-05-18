"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ProfileInvitationActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function success(message: string): ProfileInvitationActionResult {
  return {
    ok: true,
    message,
  };
}

function fail(
  message: string,
  redirectTo?: string,
): ProfileInvitationActionResult {
  return {
    ok: false,
    message,
    redirectTo,
  };
}

function getValue(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim();
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.databaseId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.databaseId,
    },
  });
}

async function respondToInvitation(
  formData: FormData,
  response: "accepted" | "rejected",
): Promise<ProfileInvitationActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return fail("Please login first.", "/login");
  }

  const inviteId = getValue(formData, "inviteId");

  if (!inviteId) {
    return fail("Invitation ID is missing.");
  }

  const invite = await prisma.teamInvite.findUnique({
    where: {
      id: inviteId,
    },
    include: {
      team: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!invite) {
    return fail("Invitation was not found.");
  }

  if (invite.invitedUserId !== user.id) {
    return fail("This invitation does not belong to you.");
  }

  if (invite.status !== "pending") {
    return fail("This invitation has already been handled.");
  }

  if (response === "rejected") {
    await prisma.teamInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        status: "rejected",
        respondedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/teams/${invite.teamId}`);

    return success("Invitation rejected.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.upsert({
      where: {
        teamId_userId: {
          teamId: invite.teamId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        teamId: invite.teamId,
        userId: user.id,
        role: "member",
      },
    });

    await tx.teamInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        status: "accepted",
        respondedAt: new Date(),
      },
    });
  });

  revalidatePath("/profile");
  revalidatePath(`/profile/teams/${invite.teamId}`);

  return success("Invitation accepted. You joined the team.");
}

export async function acceptProfileInvitationInline(
  formData: FormData,
): Promise<ProfileInvitationActionResult> {
  return respondToInvitation(formData, "accepted");
}

export async function rejectProfileInvitationInline(
  formData: FormData,
): Promise<ProfileInvitationActionResult> {
  return respondToInvitation(formData, "rejected");
}
