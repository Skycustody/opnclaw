import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail, readTenantConfig } from "@/lib/tenant";
import ChannelsClient from "./ChannelsClient";

export default async function ChannelsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const config = await readTenantConfig(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Channels</h1>
        <p className="oc-page-sub">
          Configure and manage chat channels for this tenant.
        </p>
      </div>
      <ChannelsClient initialChannels={config.channels} />
    </>
  );
}
