import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail, readTenantConfig } from "@/lib/tenant";
import { getOpenClawChannelStatus } from "@/lib/openclaw";

export default async function ChannelsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const config = await readTenantConfig(tenantId);
  const channelStatuses = await getOpenClawChannelStatus().catch(() => []);

  const channels = [
    {
      name: "telegram",
      configured: channelStatuses.find((c) => c.name === "telegram")
        ?.configured ?? config.channels.telegram.enabled,
      running:
        channelStatuses.find((c) => c.name === "telegram")?.running ?? false,
      mode: channelStatuses.find((c) => c.name === "telegram")?.mode,
      lastStart: channelStatuses.find((c) => c.name === "telegram")?.lastStart,
      lastProbe: channelStatuses.find((c) => c.name === "telegram")?.lastProbe,
      probeOk: channelStatuses.find((c) => c.name === "telegram")?.probeOk,
    },
    {
      name: "whatsapp",
      configured: config.channels.whatsapp.enabled,
      running: false,
    },
    {
      name: "discord",
      configured: config.channels.discord.enabled,
      running: false,
    },
    {
      name: "slack",
      configured: config.channels.slack.enabled,
      running: false,
    },
    {
      name: "signal",
      configured: config.channels.signal.enabled,
      running: false,
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Channels</h1>
        <p className="oc-page-sub">Manage channels and settings.</p>
      </div>

      <div className="space-y-4">
        {channels.map((ch) => (
          <section key={ch.name} className="oc-card">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--oc-text-strong)] capitalize">
                {ch.name}
              </h2>
              <div className="flex items-center gap-2">
                {ch.running && (
                  <span className="oc-pill ok">Running</span>
                )}
                {ch.configured && !ch.running && (
                  <span className="oc-pill warn">Configured</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-[var(--oc-muted)]">Configured:</span>
                <span className="ml-2 text-[var(--oc-text)]">
                  {ch.configured ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="text-[var(--oc-muted)]">Running:</span>
                <span className="ml-2 text-[var(--oc-text)]">
                  {ch.running ? "Yes" : "No"}
                </span>
              </div>
              {ch.mode && (
                <div>
                  <span className="text-[var(--oc-muted)]">Mode:</span>
                  <span className="ml-2 text-[var(--oc-text)]">{ch.mode}</span>
                </div>
              )}
              {ch.lastStart && (
                <div>
                  <span className="text-[var(--oc-muted)]">Last start:</span>
                  <span className="ml-2 text-[var(--oc-text)]">
                    {ch.lastStart}
                  </span>
                </div>
              )}
              {ch.lastProbe && (
                <div>
                  <span className="text-[var(--oc-muted)]">Last probe:</span>
                  <span className="ml-2 text-[var(--oc-text)]">
                    {ch.lastProbe}
                  </span>
                </div>
              )}
            </div>

            {ch.name === "telegram" && ch.configured && (
              <div className="mt-3 pt-3 border-t border-[var(--oc-border)]">
                <p className="text-xs text-[var(--oc-muted)] mb-2">
                  Simplest way to get started: register a bot with BotFather and
                  use get-going.
                </p>
                {config.channels.telegram.pairingCode && (
                  <div className="text-xs">
                    <span className="text-[var(--oc-muted)]">Pairing Code:</span>
                    <span className="ml-2 font-mono text-[var(--oc-text)]">
                      {config.channels.telegram.pairingCode}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
