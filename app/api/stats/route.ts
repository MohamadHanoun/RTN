import { NextResponse } from "next/server";
import { serverStats } from "@/data/stats";

export function GET() {
  return NextResponse.json({
    success: true,
    source: "static-data",
    data: serverStats,
  });
}