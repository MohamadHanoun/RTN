"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminRegistrationActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function success(message: string): AdminRegistrationActionResult {
  return {
    ok: true,
    message,
  };
}

function fail(
  message: string,
  redirectTo?: string,
): AdminRegistrationActionResult {
  return {
    ok: false,
    message,
    redirectTo,
  };
}

async function requireAdmin(): Promise<AdminRegistrationActionResult | null> {
  const session = await auth();

  const sessionUser = session?.user as
    | {
        databaseId?: string;
        isAdmin?: boolean;
      }
    | undefined;

  if (!sessionUser?.databaseId) {
    return fail("Please login first.", "/login");
  }

  if (!sessionUser.isAdmin) {
    return fail("Only RTN admins can manage tournament registrations.");
  }

  return null;
}

function getRegistrationId(formData: FormData) {
  return String(
    formData.get("registrationId") || formData.get("id") || "",
  ).trim();
}

export async function approveRegistrationInline(
  formData: FormData,
): Promise<AdminRegistrationActionResult> {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const registrationId = getRegistrationId(formData);

  if (!registrationId) {
    return fail("Registration ID is missing.");
  }

  const registration = await prisma.tournamentRegistration.findUnique({
    where: {
      id: registrationId,
    },
    include: {
      tournament: true,
      team: true,
    },
  });

  if (!registration) {
    return fail("Registration was not found.");
  }

  await prisma.tournamentRegistration.update({
    where: {
      id: registration.id,
    },
    data: {
      status: "approved",
      rejectionReason: null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/tournaments/${registration.tournamentId}`);
  revalidatePath("/profile");

  return success("Registration approved successfully.");
}

export async function rejectRegistrationInline(
  formData: FormData,
): Promise<AdminRegistrationActionResult> {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const registrationId = getRegistrationId(formData);
  const rejectionReason = String(formData.get("rejectionReason") || "").trim();

  if (!registrationId) {
    return fail("Registration ID is missing.");
  }

  if (!rejectionReason) {
    return fail("Rejection reason is required.");
  }

  const registration = await prisma.tournamentRegistration.findUnique({
    where: {
      id: registrationId,
    },
    include: {
      tournament: true,
      team: true,
    },
  });

  if (!registration) {
    return fail("Registration was not found.");
  }

  await prisma.tournamentRegistration.update({
    where: {
      id: registration.id,
    },
    data: {
      status: "rejected",
      rejectionReason,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/tournaments/${registration.tournamentId}`);
  revalidatePath("/profile");

  return success("Registration rejected successfully.");
}

export async function cancelRegistrationInline(
  formData: FormData,
): Promise<AdminRegistrationActionResult> {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const registrationId = getRegistrationId(formData);

  if (!registrationId) {
    return fail("Registration ID is missing.");
  }

  const registration = await prisma.tournamentRegistration.findUnique({
    where: {
      id: registrationId,
    },
  });

  if (!registration) {
    return fail("Registration was not found.");
  }

  await prisma.tournamentRegistration.update({
    where: {
      id: registration.id,
    },
    data: {
      status: "cancelled",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/tournaments/${registration.tournamentId}`);
  revalidatePath("/profile");

  return success("Registration cancelled successfully.");
}
