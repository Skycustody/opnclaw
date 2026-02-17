import { cookies } from "next/headers";
import { parseSessionValue } from "@/lib/auth";
import {
  DEFAULT_MODEL_ID,
  getTenantIdFromEmail,
  readTenantConfig,
} from "@/lib/tenant";
import SettingsClient from "./SettingsClient";
import ConfigEditor from "./ConfigEditor";

export default async function ConfigPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  const tenantId = session ? getTenantIdFromEmail(session.email) : "";
  const config = await readTenantConfig(tenantId);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Config</h1>
        <p className="oc-page-sub">
          Model, channels, and tenant configuration.
        </p>
      </div>
      <div className="space-y-6">
        <SettingsClient
          initialChannels={config.channels}
          initialModel={config.model ?? DEFAULT_MODEL_ID}
        />
        <ConfigEditor initialConfig={config} />
      </div>
    </>
  );
}
