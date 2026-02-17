import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie } from "@/lib/auth";
import {
  DEFAULT_MODEL_ID,
  getTenantIdFromEmail,
  readTenantConfig,
  writeTenantConfig,
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
    model: config.model ?? DEFAULT_MODEL_ID,
  } satisfies Pick<TenantConfig, "channels" | "model">);
}

export async function POST(request: NextRequest) {
  const session = parseSessionCookie(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const hasTelegram =
    typeof body?.telegramEnabled === "boolean" ||
    typeof body?.telegramEnabled === "undefined";

  const tenantId = getTenantIdFromEmail(session.email);
  let config = await readTenantConfig(tenantId);
  let pairingCode: string | undefined;

  // Update Telegram via helper to preserve pairing semantics
  if (typeof body?.telegramEnabled === "boolean") {
    const telegramResult = await updateTelegramChannel(tenantId, {
      enabled: body.telegramEnabled,
    });
    config = telegramResult.config;
    pairingCode = telegramResult.pairingCode;
  }

  // Update other channels + model directly on the tenant config
  const next: TenantConfig = {
    ...config,
    channels: {
      ...config.channels,
      whatsapp: {
        ...config.channels.whatsapp,
        ...(typeof body?.whatsappEnabled === "boolean"
          ? { enabled: body.whatsappEnabled }
          : {}),
      },
      discord: {
        ...config.channels.discord,
        ...(typeof body?.discordEnabled === "boolean"
          ? { enabled: body.discordEnabled }
          : {}),
      },
      slack: {
        ...config.channels.slack,
        ...(typeof body?.slackEnabled === "boolean"
          ? { enabled: body.slackEnabled }
          : {}),
      },
      signal: {
        ...config.channels.signal,
        ...(typeof body?.signalEnabled === "boolean"
          ? { enabled: body.signalEnabled }
          : {}),
      },
    },
    model:
      typeof body?.model === "string" && body.model.length > 0
        ? body.model
        : config.model ?? DEFAULT_MODEL_ID,
  };

  await writeTenantConfig(tenantId, next);

  return NextResponse.json({
    channels: next.channels,
    model: next.model,
    telegramPairingCode: pairingCode,
  });
}

