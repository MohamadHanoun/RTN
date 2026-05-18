"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AdminTournamentActionResult } from "@/actions/adminTournamentInlineActions";

function success(message: string): AdminTournamentActionResult {
  return {
    ok: true,
    message,
  };
}

function fail(
  message: string,
  redirectTo?: string,
): AdminTournamentActionResult {
  return {
    ok: false,
    message,
    redirectTo,
  };
}

function getValue(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim();
}

function getNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));

  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}

async function requireAdmin(): Promise<AdminTournamentActionResult | null> {
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
    return fail("Only RTN admins can manage tournament results.");
  }

  return null;
}

export async function saveTournamentResultInline(
  formData: FormData,
): Promise<AdminTournamentActionResult> {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const tournamentId = getValue(formData, "tournamentId");
  const teamId = getValue(formData, "teamId");
  const note = getValue(formData, "note") || null;
  const placement = getNumber(formData, "placement");
  const points = getNumber(formData, "points");

  if (!tournamentId) {
    return fail("Tournament ID is missing.");
  }

  if (!teamId) {
    return fail("Select a team first.");
  }

  if (!placement || placement < 1) {
    return fail("Placement must be at least 1.");
  }

  if (points === null || points < 0) {
    return fail("Points must be 0 or higher.");
  }

  const registration = await prisma.tournamentRegistration.findUnique({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId,
      },
    },
    include: {
      tournament: true,
      team: true,
    },
  });

  if (!registration) {
    return fail("This team is not registered for this tournament.");
  }

  if (!["registered", "approved"].includes(registration.status)) {
    return fail("Only registered or approved teams can receive results.");
  }

  await prisma.tournamentResult.upsert({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId,
      },
    },
    create: {
      tournamentId,
      teamId,
      placement,
      points,
      note,
    },
    update: {
      placement,
      points,
      note,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/stats");
  revalidatePath(`/tournaments/${tournamentId}`);

  return success(
    `${registration.team.name} result saved with ${points} tournament points.`,
  );
}

export async function deleteTournamentResultInline(
  formData: FormData,
): Promise<AdminTournamentActionResult> {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const resultId = getValue(formData, "resultId");
  const tournamentId = getValue(formData, "tournamentId");

  if (!resultId) {
    return fail("Result ID is missing.");
  }

  const result = await prisma.tournamentResult.findUnique({
    where: {
      id: resultId,
    },
    include: {
      team: true,
    },
  });

  if (!result) {
    return fail("Tournament result was not found.");
  }

  await prisma.tournamentResult.delete({
    where: {
      id: result.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/stats");

  if (tournamentId) {
    revalidatePath(`/tournaments/${tournamentId}`);
  }

  return success(`${result.team.name} result deleted.`);
}
