import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [
      rulesCount,
      rolesCount,
      staffCount,
      tournamentsCount,
      announcementsCount,
      usersCount,
      teamsCount,
      approvedRegistrationsCount,
      tournamentResultsCount,
      tournamentPoints,
    ] = await Promise.all([
      prisma.rule.count({ where: { isActive: true } }),
      prisma.role.count({ where: { isActive: true } }),
      prisma.staffMember.count({ where: { isActive: true } }),
      prisma.tournament.count(),
      prisma.announcement.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.team.count(),
      prisma.tournamentRegistration.count({
        where: {
          status: "approved",
        },
      }),
      prisma.tournamentResult.count(),
      prisma.tournamentResult.aggregate({
        _sum: {
          points: true,
        },
      }),
    ]);

    const totalTournamentPoints = tournamentPoints._sum.points || 0;

    return NextResponse.json({
      success: true,
      source: "database",
      data: {
        summary: [
          { label: "Players", value: String(usersCount) },
          { label: "Teams", value: String(teamsCount) },
          { label: "Tournaments", value: String(tournamentsCount) },
          { label: "Results", value: String(tournamentResultsCount) },
          { label: "Points", value: String(totalTournamentPoints) },
        ],
        details: [
          {
            title: "Players",
            value: String(usersCount),
            description: "Players who have logged in with Discord.",
          },
          {
            title: "Teams",
            value: String(teamsCount),
            description: "Teams created by RTN players.",
          },
          {
            title: "Tournaments",
            value: String(tournamentsCount),
            description: "Tournament records available on RTN.",
          },
          {
            title: "Tournament Results",
            value: String(tournamentResultsCount),
            description: "Final tournament results saved by admins.",
          },
          {
            title: "Tournament Points",
            value: String(totalTournamentPoints),
            description: "Total points awarded from tournament results.",
          },
          {
            title: "Approved Registrations",
            value: String(approvedRegistrationsCount),
            description: "Tournament registrations approved by admins.",
          },
          {
            title: "Announcements",
            value: String(announcementsCount),
            description: "Published community announcements.",
          },
          {
            title: "Rules",
            value: String(rulesCount),
            description: "Active community rules.",
          },
          {
            title: "Roles",
            value: String(rolesCount),
            description: "Active community roles.",
          },
          {
            title: "Staff",
            value: String(staffCount),
            description: "Visible staff members.",
          },
        ],
      },
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch stats",
      },
      { status: 500 },
    );
  }
}
