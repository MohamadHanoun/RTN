import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const staff = await prisma.staffMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      source: "database",
      data: staff,
    });
  } catch (error) {
    console.error("Failed to fetch staff:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch staff",
      },
      { status: 500 },
    );
  }
}