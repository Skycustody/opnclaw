import os from "os";
import path from "path";
import fs from "fs/promises";

export type TenantConfig = {
  channels: {
    telegram: {
      enabled: boolean;
      pairingCode?: string;
    };
  };
};

const DEFAULT_CONFIG: TenantConfig = {
  channels: {
    telegram: {
      enabled: false,
    },
  },
};

export function getTenantIdFromEmail(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function getTenantsRootDir(): string {
  const custom = process.env.OPENCLAW_TENANTS_DIR;
  if (custom && custom.length > 0) return custom;
  return path.join(os.homedir(), ".openclaw-ui", "tenants");
}

export function getTenantDir(tenantId: string): string {
  return path.join(getTenantsRootDir(), tenantId);
}

export function getTenantConfigPath(tenantId: string): string {
  return path.join(getTenantDir(tenantId), "openclaw.json");
}

export async function ensureTenantDir(tenantId: string): Promise<void> {
  const dir = getTenantDir(tenantId);
  await fs.mkdir(dir, { recursive: true });
}

export async function readTenantConfig(tenantId: string): Promise<TenantConfig> {
  const configPath = getTenantConfigPath(tenantId);

  try {
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as TenantConfig;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      channels: {
        ...DEFAULT_CONFIG.channels,
        ...(parsed.channels || {}),
        telegram: {
          ...DEFAULT_CONFIG.channels.telegram,
          ...(parsed.channels?.telegram || {}),
        },
      },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function writeTenantConfig(
  tenantId: string,
  config: TenantConfig,
): Promise<void> {
  await ensureTenantDir(tenantId);
  const configPath = getTenantConfigPath(tenantId);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
}

