import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import {
  DEFAULT_MODEL_ID,
  getTenantIdFromEmail,
  readTenantConfig,
} from "@/lib/tenant";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const config = await readTenantConfig(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Settings</h1>
        <p className="oc-page-sub">
          Model and chat channels for this tenant.
        </p>
      </div>
      <SettingsClient
        initialChannels={config.channels}
        initialModel={config.model ?? DEFAULT_MODEL_ID}
      />
    </>
  );
}
