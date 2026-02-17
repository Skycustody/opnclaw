import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  readTenantConfig,
  writeTenantConfig,
  type TenantConfig,
} from "@/lib/tenant";

export type OpenClawStatus = {
  gatewayStatus: "ok" | "degraded" | "offline";
  tenantId: string;
  model?: string;
  channels: {
    telegram: {
      enabled: boolean;
      pairingCode?: string;
    };
    whatsapp: {
      enabled: boolean;
    };
    discord: {
      enabled: boolean;
    };
    slack: {
      enabled: boolean;
    };
    signal: {
      enabled: boolean;
    };
  };
  sessions: Array<{
    id: string;
    channel: string;
    lastMessageAt: string;
    status: "active" | "idle";
  }>;
};

const execFileAsync = promisify(execFile);

async function getGatewayStatusFromCli(): Promise<
  OpenClawStatus["gatewayStatus"]
> {
  try {
    const { stdout } = await execFileAsync("openclaw", [
      "gateway",
      "status",
      "--json",
    ]);
    const data = JSON.parse(stdout);

    const serviceStatus: string | undefined =
      data?.service?.status ?? data?.status;
    const probeOk: boolean | undefined =
      data?.probe?.ok ?? data?.rpc?.ok ?? data?.gateway?.ok;

    if (probeOk === true) return "ok";
    if (serviceStatus === "active" || serviceStatus === "running") {
      return "degraded";
    }
    return "offline";
  } catch {
    // If the CLI is missing or JSON shape is unexpected, fall back to "offline".
    return "offline";
  }
}

export async function getOpenClawStatus(
  tenantId: string,
): Promise<OpenClawStatus> {
  const config = await readTenantConfig(tenantId);
  const gatewayStatus = await getGatewayStatusFromCli().catch(
    () => "offline" as const,
  );

  return {
    gatewayStatus,
    tenantId,
    model: config.model,
    channels: {
      telegram: {
        enabled: config.channels.telegram.enabled,
        pairingCode: config.channels.telegram.pairingCode,
      },
      whatsapp: {
        enabled: config.channels.whatsapp.enabled,
      },
      discord: {
        enabled: config.channels.discord.enabled,
      },
      slack: {
        enabled: config.channels.slack.enabled,
      },
      signal: {
        enabled: config.channels.signal.enabled,
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

