import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        teamMemberships: {
          include: {
            team: {
              include: {
                results: {
                  select: {
                    id: true,
                    points: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const leaderboard = users
      .map((user) => {
        const tournamentResults = user.teamMemberships.reduce(
          (total, membership) => total + membership.team.results.length,
          0,
        );

        const tournamentPoints = user.teamMemberships.reduce(
          (total, membership) =>
            total +
            membership.team.results.reduce(
              (pointsTotal, result) => pointsTotal + result.points,
              0,
            ),
          0,
        );

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          tournamentResults,
          tournamentPoints,
        };
      })
      .filter((user) => user.tournamentPoints > 0)
      .sort((a, b) => {
        if (b.tournamentPoints !== a.tournamentPoints) {
          return b.tournamentPoints - a.tournamentPoints;
        }

        return b.tournamentResults - a.tournamentResults;
      })
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      source: "database",
      data: leaderboard,
    });
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);

    return NextResponse.json(
{
        success: false,
        message: "Failed to fetch leaderboard",
      },
      { status: 500 },
    );
  }
}
