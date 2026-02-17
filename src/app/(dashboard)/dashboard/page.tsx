import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import {
  getOpenClawOverview,
  getOpenClawInstances,
  getOpenClawSessions,
} from "@/lib/openclaw";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";

  const [overview, instances, sessions] = await Promise.all([
    getOpenClawOverview().catch(() => null),
    getOpenClawInstances().catch(() => []),
    getOpenClawSessions().catch(() => []),
  ]);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Overview</h1>
        <p className="oc-page-sub">
          Gateway status, entry points, and a fast health read.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {overview && (
          <>
            <section className="oc-card">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
                Gateway Access
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--oc-muted)]">Websocket URL:</span>
                  <div className="font-mono text-[var(--oc-text)] mt-1">
                    {overview.gatewayUrl}
                  </div>
                </div>
                {overview.gatewayToken && (
                  <div>
                    <span className="text-[var(--oc-muted)]">Gateway Token:</span>
                    <div className="font-mono text-[11px] text-[var(--oc-text)] mt-1 break-all">
                      {overview.gatewayToken.slice(0, 20)}...
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-[var(--oc-muted)]">Default Session Key:</span>
                  <div className="font-mono text-[var(--oc-text)] mt-1">main</div>
                </div>
              </div>
            </section>

            <section className="oc-card">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
                Snapshot
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--oc-muted)]">Status:</span>
                  <span
                    className={`ml-2 ${
                      overview.status === "Connected"
                        ? "text-[var(--oc-ok)]"
                        : "text-[var(--oc-muted)]"
                    }`}
                  >
                    {overview.status}
                  </span>
                </div>
                {overview.uptime && (
                  <div>
                    <span className="text-[var(--oc-muted)]">Uptime:</span>
                    <span className="ml-2 text-[var(--oc-text)]">
                      {overview.uptime}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[var(--oc-muted)]">Last Channels Refresh:</span>
                  <span className="ml-2 text-[var(--oc-text)]">just now</span>
                </div>
              </div>
              <p className="text-xs text-[var(--oc-muted)] mt-3">
                Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.
              </p>
            </section>
          </>
        )}

        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Instances
          </h2>
          <div className="text-2xl font-bold text-[var(--oc-text-strong)] mb-1">
            {instances.length}
          </div>
          <p className="text-xs text-[var(--oc-muted)]">
            Presence beacons in the last 5 minutes.
          </p>
        </section>

        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Sessions
          </h2>
          <div className="text-2xl font-bold text-[var(--oc-text-strong)] mb-1">
            {sessions.length}
          </div>
          <p className="text-xs text-[var(--oc-muted)]">
            Recent session keys tracked by the gateway.
          </p>
        </section>

        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Cron
          </h2>
          <div className="text-sm text-[var(--oc-text)] mb-1">
            {overview?.cronEnabled ? "Cron Enabled" : "Cron Disabled"}
          </div>
          <p className="text-xs text-[var(--oc-muted)]">
            Next wake via scheduler.
          </p>
        </section>
      </div>

      <section className="oc-card mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Notes
        </h2>
        <p className="text-sm text-[var(--oc-muted)]">
          Quick reminders for remote control setups.
        </p>
        <div className="mt-3 space-y-2">
          <div className="oc-card" style={{ background: "var(--oc-bg-elevated)", padding: "12px" }}>
            <h3 className="text-xs font-medium text-[var(--oc-text-strong)] mb-1">
              Tailscale serve
            </h3>
            <p className="text-xs text-[var(--oc-muted)]">
              Prefer serve mode to keep the gateway on loopback with tailnet auth.
            </p>
          </div>
          <div className="oc-card" style={{ background: "var(--oc-bg-elevated)", padding: "12px" }}>
            <h3 className="text-xs font-medium text-[var(--oc-text-strong)] mb-1">
              Session hygiene
            </h3>
            <p className="text-xs text-[var(--oc-muted)]">
              Use sessions.patch to reset context when needed.
            </p>
          </div>
          <div className="oc-card" style={{ background: "var(--oc-bg-elevated)", padding: "12px" }}>
            <h3 className="text-xs font-medium text-[var(--oc-text-strong)] mb-1">
              Cron reminders
            </h3>
            <p className="text-xs text-[var(--oc-muted)]">
              Use isolated sessions for recurring runs.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
