import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import { getOpenClawStatus } from "@/lib/openclaw";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  if (!session) {
    redirect("/login");
  }
  const tenantId = getTenantIdFromEmail(session.email);
  const status = await getOpenClawStatus(tenantId);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              OpenClaw Control
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Tenant <span className="font-mono">{tenantId}</span> (
              {session.email})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/settings"
              className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Settings
            </a>
            <form
              action="/api/auth/logout"
              method="POST"
              className="inline-flex"
            >
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Log out
              </button>
            </form>
          </div>
        </header>

        <main className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Gateway
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              High-level status for this tenant as reported by the central
              OpenClaw gateway.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  status.gatewayStatus === "ok"
                    ? "bg-emerald-500"
                    : status.gatewayStatus === "degraded"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-xs font-medium capitalize text-zinc-800 dark:text-zinc-100">
                {status.gatewayStatus}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:col-span-2">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Channels
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              These are the chat channels wired for this tenant. Toggle and
              pair them from the settings page.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-700">
                <span className="font-medium text-zinc-800 dark:text-zinc-100">
                  Telegram
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    status.channels.telegram.enabled
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {status.channels.telegram.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:col-span-3">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Sessions (stub)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              For now this is a mocked view based on the tenant config. Later
              this should call your real OpenClaw gateway for live sessions and
              logs.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 text-xs dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                      Session ID
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                      Channel
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                      Last message
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                  {status.sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-3 py-2 font-mono text-[11px] text-zinc-800 dark:text-zinc-100">
                        {session.id}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {session.channel}
                      </td>
                      <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                        {new Date(session.lastMessageAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            session.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

