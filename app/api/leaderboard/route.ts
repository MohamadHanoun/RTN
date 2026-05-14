import { NextResponse } from "next/server";
import { leaderboardUsers } from "@/data/leaderboard";

export function GET() {
  return NextResponse.json({
    success: true,
    source: "static-data",
    data: leaderboardUsers,
  });
}