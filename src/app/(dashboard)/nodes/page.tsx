import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";

export default async function NodesPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Nodes</h1>
        <p className="oc-page-sub">
          Manage connected device nodes (iOS, Android, macOS) for this tenant.
        </p>
      </div>
      <div className="oc-card">
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Nodes are device clients (iOS/Android apps, macOS menu bar) that connect to the gateway.
        </p>
        <p className="text-xs text-[var(--oc-muted)]">
          Node management will be available once integrated with OpenClaw gateway. Nodes can be paired, monitored, and controlled per tenant.
        </p>
      </div>
    </>
  );
}
