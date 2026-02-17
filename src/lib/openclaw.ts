import crypto from "crypto";
import {
  readTenantConfig,
  writeTenantConfig,
  type TenantConfig,
} from "@/lib/tenant";

export type OpenClawStatus = {
  gatewayStatus: "ok" | "degraded" | "offline";
  tenantId: string;
  channels: {
    telegram: {
      enabled: boolean;
      pairingCode?: string;
    };
  };
  sessions: Array<{
    id: string;
    channel: string;
    lastMessageAt: string;
    status: "active" | "idle";
  }>;
};

export async function getOpenClawStatus(
  tenantId: string,
): Promise<OpenClawStatus> {
  // For now this is a stub that only looks at the per-tenant config file.
  // Later you can replace this with real calls to your OpenClaw gateway
  // (CLI or HTTP) using OPENCLAW_CONFIG_PATH pointing at this tenant's config.
  const config = await readTenantConfig(tenantId);

  return {
    gatewayStatus: "ok",
    tenantId,
    channels: {
      telegram: {
        enabled: config.channels.telegram.enabled,
        pairingCode: config.channels.telegram.pairingCode,
      },
    },
    sessions: [
      {
        id: "example-session",
        channel: config.channels.telegram.enabled ? "telegram" : "none",
        lastMessageAt: new Date().toISOString(),
        status: "idle",
      },
    ],
  };
}

export async function updateTelegramChannel(
  tenantId: string,
  options: { enabled: boolean },
): Promise<{ config: TenantConfig; pairingCode?: string }> {
  const current = await readTenantConfig(tenantId);
  const next: TenantConfig = {
    ...current,
    channels: {
      ...current.channels,
      telegram: {
        ...current.channels.telegram,
        enabled: options.enabled,
      },
    },
  };

  let pairingCode: string | undefined;

  if (options.enabled && !next.channels.telegram.pairingCode) {
    pairingCode = generatePairingCode(tenantId);
    next.channels.telegram.pairingCode = pairingCode;
  } else {
    pairingCode = next.channels.telegram.pairingCode;
  }

  await writeTenantConfig(tenantId, next);
  return { config: next, pairingCode };
}

function generatePairingCode(tenantId: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(tenantId + Date.now().toString())
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();

  return `${hash.slice(0, 4)}-${hash.slice(4)}`;
}

