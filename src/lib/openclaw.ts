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

export type OpenClawInstance = {
  id: string;
  ip: string;
  role: string;
  tags: string[];
  lastSeen: string;
};

export type OpenClawSession = {
  key: string;
  label?: string;
  kind: string;
  updated: string;
  tokens: string;
  tracing?: string;
  reasoning?: string;
};

export type OpenClawChannelStatus = {
  name: string;
  configured: boolean;
  running: boolean;
  mode?: string;
  lastStart?: string;
  lastProbe?: string;
  probeOk?: boolean;
};

async function callOpenClawCli(
  args: string[],
): Promise<unknown> {
  try {
    const { stdout } = await execFileAsync("openclaw", [
      ...args,
      "--json",
    ]);
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

export async function getOpenClawInstances(): Promise<OpenClawInstance[]> {
  const data = await callOpenClawCli(["gateway", "call", "system-presence"]);
  if (!data || typeof data !== "object") return [];

  const instances = (data as { instances?: unknown[] })?.instances ?? [];
  return instances.map((inst: any) => ({
    id: inst.id ?? inst.identifier ?? "unknown",
    ip: inst.ip ?? inst.address ?? "",
    role: inst.role ?? "unknown",
    tags: Array.isArray(inst.tags) ? inst.tags : [],
    lastSeen: inst.lastSeen ?? inst.updated ?? new Date().toISOString(),
  }));
}

export async function getOpenClawSessions(): Promise<OpenClawSession[]> {
  const data = await callOpenClawCli(["gateway", "call", "sessions.list"]);
  if (!data || typeof data !== "object") return [];

  const sessions = (data as { sessions?: unknown[] })?.sessions ?? [];
  return sessions.map((sess: any) => ({
    key: sess.key ?? sess.id ?? "unknown",
    label: sess.label,
    kind: sess.kind ?? "direct",
    updated: sess.updated ?? sess.lastMessageAt ?? new Date().toISOString(),
    tokens: sess.tokens
      ? `${sess.tokens.used ?? 0} / ${sess.tokens.limit ?? 0}`
      : "0 / 0",
    tracing: sess.tracing,
    reasoning: sess.reasoning,
  }));
}

export async function getOpenClawChannelStatus(): Promise<
  OpenClawChannelStatus[]
> {
  const data = await callOpenClawCli(["gateway", "call", "channels.status"]);
  if (!data || typeof data !== "object") return [];

  const channels = (data as { channels?: Record<string, unknown> })
    ?.channels ?? {};
  return Object.entries(channels).map(([name, ch]: [string, any]) => ({
    name,
    configured: ch.configured ?? false,
    running: ch.running ?? ch.status === "running",
    mode: ch.mode,
    lastStart: ch.lastStart,
    lastProbe: ch.lastProbe,
    probeOk: ch.probeOk,
  }));
}

export async function getOpenClawOverview(): Promise<{
  gatewayUrl: string;
  gatewayToken?: string;
  status: string;
  uptime?: string;
  instancesCount: number;
  sessionsCount: number;
  cronEnabled: boolean;
}> {
  const statusData = await callOpenClawCli(["gateway", "status"]);
  const instances = await getOpenClawInstances();
  const sessions = await getOpenClawSessions();

  const gatewayUrl =
    (statusData as any)?.listening ?? "ws://127.0.0.1:18789";
  const gatewayToken = (statusData as any)?.token;
  const status = (statusData as any)?.probe?.ok ? "Connected" : "Disconnected";
  const uptime = (statusData as any)?.uptime;

  return {
    gatewayUrl,
    gatewayToken,
    status,
    uptime,
    instancesCount: instances.length,
    sessionsCount: sessions.length,
    cronEnabled: false, // TODO: get from cron.status
  };
}

