import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";

export default async function SkillsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Skills</h1>
        <p className="oc-page-sub">
          View and manage available skills for this tenant.
        </p>
      </div>
      <div className="oc-card">
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Skills extend OpenClaw's capabilities with custom tools and workflows.
        </p>
        <p className="text-xs text-[var(--oc-muted)]">
          Skill management will be available once integrated with OpenClaw gateway. Skills can be installed, enabled, and configured per tenant.
        </p>
      </div>
    </>
  );
}
