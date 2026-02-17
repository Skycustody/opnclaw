import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import { getOpenClawStatus } from "@/lib/openclaw";

const CHANNEL_KEYS = [
  "telegram",
  "whatsapp",
  "discord",
  "slack",
  "signal",
] as const;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const status = await getOpenClawStatus(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Overview</h1>
        <p className="oc-page-sub">
          Gateway status, channels, and sessions for this tenant.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Gateway
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background:
                  status.gatewayStatus === "ok"
                    ? "var(--oc-ok)"
                    : status.gatewayStatus === "degraded"
                      ? "var(--oc-warn)"
                      : "#ef4444",
              }}
            />
            <span className="text-sm font-medium capitalize text-[var(--oc-text-strong)]">
              {status.gatewayStatus}
            </span>
          </div>
        </section>

        {status.model && (
          <section className="oc-card">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
              Model
            </h2>
            <p className="text-sm font-mono text-[var(--oc-text)] mt-2">
              {status.model}
            </p>
          </section>
        )}
      </div>

      <section className="oc-card mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Channels
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Chat channels wired for this tenant. Toggle them in Settings.
        </p>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_KEYS.map((key) => {
            const enabled = status.channels[key]?.enabled ?? false;
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <span
                key={key}
                className={`oc-pill ${enabled ? "ok" : "off"}`}
              >
                {label} — {enabled ? "On" : "Off"}
              </span>
            );
          })}
        </div>
      </section>

      <section className="oc-card mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Sessions
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Active sessions (stub). Real data will come from the OpenClaw gateway.
        </p>
        <div className="oc-table-wrap">
          <table className="oc-table w-full">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Channel</th>
                <th>Last message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {status.sessions.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-[11px] text-[var(--oc-text)]">
                    {s.id}
                  </td>
                  <td className="text-[var(--oc-text)]">{s.channel}</td>
                  <td className="text-[var(--oc-muted)]">
                    {new Date(s.lastMessageAt).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`oc-pill ${s.status === "active" ? "ok" : "off"}`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
