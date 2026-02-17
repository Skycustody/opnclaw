import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import SessionsClient from "./SessionsClient";

export default async function SessionsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Sessions</h1>
        <p className="oc-page-sub">
          View and manage active chat sessions for this tenant.
        </p>
      </div>
      <SessionsClient tenantId={tenantId} />
    </>
  );
}
