import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import { getOpenClawStatus } from "@/lib/openclaw";
import DebugClient from "./DebugClient";

export default async function DebugPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const status = await getOpenClawStatus(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Debug</h1>
        <p className="oc-page-sub">
          Debug tools and diagnostics for this tenant.
        </p>
      </div>
      <div className="space-y-4">
        <div className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
            Gateway Status
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--oc-text)]">Status</span>
              <span className={`oc-pill ${status.gatewayStatus === "ok" ? "ok" : status.gatewayStatus === "degraded" ? "warn" : "off"}`}>
                {status.gatewayStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--oc-text)]">Tenant ID</span>
              <span className="text-sm font-mono text-[var(--oc-muted)]">{status.tenantId}</span>
            </div>
          </div>
        </div>
        <DebugClient tenantId={tenantId} />
      </div>
    </>
  );
}
