import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import { getOpenClawStatus } from "@/lib/openclaw";

export default async function UsagePage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const status = await getOpenClawStatus(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Usage</h1>
        <p className="oc-page-sub">
          Monitor API usage and costs for this tenant.
        </p>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Model
          </h2>
          <p className="text-sm font-mono text-[var(--oc-text)] mt-2">
            {status.model || "Not set"}
          </p>
        </div>
        <div className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Active Channels
          </h2>
          <p className="text-2xl font-semibold text-[var(--oc-text-strong)] mt-2">
            {Object.values(status.channels).filter((c: any) => c?.enabled).length}
          </p>
        </div>
        <div className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
            Sessions
          </h2>
          <p className="text-2xl font-semibold text-[var(--oc-text-strong)] mt-2">
            {status.sessions.length}
          </p>
        </div>
      </div>
      <div className="oc-card mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Usage Details
        </h2>
        <p className="text-sm text-[var(--oc-muted)]">
          Detailed usage tracking and cost breakdown will be available once integrated with OpenClaw gateway metrics.
        </p>
      </div>
    </>
  );
}
