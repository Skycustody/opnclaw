import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";
import {
  getTenantIdFromEmail,
  readTenantConfig,
  type TenantConfig,
} from "@/lib/tenant";
import { updateTelegramChannel } from "@/lib/openclaw";

export async function GET(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tenantId = getTenantIdFromEmail(session.email);
  const config = await readTenantConfig(tenantId);

  return NextResponse.json({
    channels: config.channels,
  } satisfies Pick<TenantConfig, "channels">);
}

export async function POST(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const telegramEnabled =
    typeof body?.telegramEnabled === "boolean" ? body.telegramEnabled : null;

  if (telegramEnabled === null) {
    return NextResponse.json(
      { error: "telegramEnabled must be a boolean" },
      { status: 400 },
    );
  }

  const tenantId = getTenantIdFromEmail(session.email);
  const { config, pairingCode } = await updateTelegramChannel(tenantId, {
    enabled: telegramEnabled,
  });

  return NextResponse.json({
    channels: config.channels,
    telegramPairingCode: pairingCode,
  });
}

