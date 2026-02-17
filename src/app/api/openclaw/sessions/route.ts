import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import { getSessionsList } from "@/lib/openclaw-api";

export async function GET(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tenantId = getTenantIdFromEmail(session.email);
  const sessions = await getSessionsList();

  return NextResponse.json({ sessions, tenantId });
}
