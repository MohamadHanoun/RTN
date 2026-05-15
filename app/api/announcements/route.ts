import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      source: "database",
      data: announcements,
    });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch announcements",
      },
      { status: 500 },
    );
  }
}