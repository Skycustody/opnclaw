import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";
import { getGatewayLogs } from "@/lib/openclaw-api";

export async function GET(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const lines = parseInt(searchParams.get("lines") || "100", 10);

  const logs = await getGatewayLogs(Math.min(lines, 1000));

  return NextResponse.json({ logs });
}
