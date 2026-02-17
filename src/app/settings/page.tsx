import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSessionValue, type SessionPayload } from "@/lib/auth";
import { getTenantIdFromEmail, readTenantConfig } from "@/lib/tenant";
import SettingsClient from "./SettingsClient";

function requireSessionFromCookies(): SessionPayload {
  const cookieStore = cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  if (!session) {
    redirect("/login");
  }
  return session;
}

export default async function SettingsPage() {
  const session = requireSessionFromCookies();
  const tenantId = getTenantIdFromEmail(session.email);
  const config = await readTenantConfig(tenantId);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              OpenClaw Control
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Chat app setup
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Configure which chat apps you want to use for{" "}
              <span className="font-mono">{tenantId}</span> ({session.email}).
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back to dashboard
          </a>
        </header>

        <SettingsClient initial={config.channels} />
      </div>
    </div>
  );
}

