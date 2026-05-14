import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
}