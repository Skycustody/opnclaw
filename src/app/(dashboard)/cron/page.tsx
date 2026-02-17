import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";

export default async function CronPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Cron Jobs</h1>
        <p className="oc-page-sub">
          Schedule and manage automated tasks for this tenant.
        </p>
      </div>
      <div className="oc-card">
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Cron jobs run automated tasks on a schedule (e.g., daily summaries, periodic checks).
        </p>
        <p className="text-xs text-[var(--oc-muted)]">
          Cron job management will be available once integrated with OpenClaw gateway. Jobs can be created, edited, enabled/disabled, and monitored per tenant.
        </p>
      </div>
    </>
  );
}
