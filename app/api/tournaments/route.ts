import { NextResponse } from "next/server";
import { tournaments } from "@/data/tournaments";

export function GET() {
  return NextResponse.json({
    success: true,
    source: "static-data",
    data: tournaments,
  });
}