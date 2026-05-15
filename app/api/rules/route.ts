import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
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
      data: rules,
    });
  } catch (error) {
    console.error("Failed to fetch rules:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch rules",
      },
      { status: 500 },
    );
  }
}
