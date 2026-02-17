import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";
import { getTenantIdFromEmail, readTenantConfig, writeTenantConfig } from "@/lib/tenant";

export async function GET(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tenantId = getTenantIdFromEmail(session.email);
  const config = await readTenantConfig(tenantId);

  return NextResponse.json({ config, tenantId });
}

export async function POST(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.config !== "object") {
    return NextResponse.json(
      { error: "config object required" },
      { status: 400 },
    );
  }

  const tenantId = getTenantIdFromEmail(session.email);
  await writeTenantConfig(tenantId, body.config);

  return NextResponse.json({ ok: true });
}
