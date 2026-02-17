import { execFile } from "child_process";
import { promisify } from "util";
import { getTenantConfigPath } from "./tenant";

const execFileAsync = promisify(execFile);

export async function getChannelsStatus(): Promise<Record<string, any>> {
  try {
    const { stdout } = await execFileAsync("openclaw", [
      "gateway",
      "call",
      "channels.status",
      "--json",
    ]);
    return JSON.parse(stdout);
  } catch {
    return {};
  }
}

export async function getSessionsList(): Promise<Array<{
  id: string;
  channel?: string;
  lastMessageAt?: string;
  status?: string;
}>> {
  try {
    const { stdout } = await execFileAsync("openclaw", [
      "gateway",
      "call",
      "sessions.list",
      "--json",
    ]);
    const data = JSON.parse(stdout);
    return Array.isArray(data) ? data : data?.sessions || [];
  } catch {
    return [];
  }
}

export async function getGatewayLogs(lines: number = 100): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync("openclaw", [
      "gateway",
      "call",
      "logs.tail",
      "--params",
      JSON.stringify({ lines }),
      "--json",
    ]);
    const data = JSON.parse(stdout);
    return Array.isArray(data?.lines) ? data.lines : [];
  } catch {
    return [];
  }
}

export async function getConfig(tenantId: string): Promise<any> {
  try {
    const configPath = getTenantConfigPath(tenantId);
    const { stdout } = await execFileAsync("openclaw", [
      "config",
      "get",
      "--json",
    ], {
      env: { ...process.env, OPENCLAW_CONFIG_PATH: configPath },
    });
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

export async function setConfig(tenantId: string, config: any): Promise<void> {
  const configPath = getTenantConfigPath(tenantId);
  await execFileAsync("openclaw", [
    "config",
    "set",
    "--json",
    JSON.stringify(config),
  ], {
    env: { ...process.env, OPENCLAW_CONFIG_PATH: configPath },
  });
}
