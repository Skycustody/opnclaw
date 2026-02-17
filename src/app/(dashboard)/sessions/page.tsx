import { getOpenClawSessions } from "@/lib/openclaw";

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default async function SessionsPage() {
  const sessions = await getOpenClawSessions().catch(() => []);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Sessions</h1>
        <p className="oc-page-sub">
          Inspect active sessions and adjust per session defaults.
        </p>
      </div>

      <section className="oc-card mb-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Sessions
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Inspect active sessions and adjust per-session management rules.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--oc-muted)] block mb-1">
              Active sessions (minutes):
            </label>
            <input
              type="number"
              defaultValue={120}
              className="w-full px-2 py-1 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--oc-muted)] block mb-1">
              Limit:
            </label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <label className="flex items-center gap-2 text-[var(--oc-text)]">
            <input type="checkbox" defaultChecked className="rounded" />
            Include global
          </label>
          <label className="flex items-center gap-2 text-[var(--oc-text)]">
            <input type="checkbox" defaultChecked className="rounded" />
            Include unknown
          </label>
        </div>
      </section>

      <section className="oc-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)]">
            Store (multiple)
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--oc-accent)]">Recently viewed</span>
            <select className="text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded px-2 py-1 text-[var(--oc-text)]">
              <option>Sort Recent</option>
            </select>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="text-sm text-[var(--oc-muted)] py-4">
            No sessions in range.
          </p>
        ) : (
          <div className="oc-table-wrap">
            <table className="oc-table w-full">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Label</th>
                  <th>Kind</th>
                  <th>Updated</th>
                  <th>Tokens</th>
                  <th>Tracing</th>
                  <th>Reasoning</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((sess) => (
                  <tr key={sess.key}>
                    <td className="font-mono text-[11px] text-[var(--oc-text)]">
                      {sess.key}
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue={sess.label ?? ""}
                        placeholder="(options)"
                        className="w-full px-2 py-1 text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
                      />
                    </td>
                    <td className="text-[var(--oc-text)] text-xs">
                      {sess.kind}
                    </td>
                    <td className="text-[var(--oc-muted)] text-xs">
                      {formatTimeAgo(sess.updated)}
                    </td>
                    <td className="text-[var(--oc-text)] text-xs">
                      {sess.tokens}
                    </td>
                    <td>
                      <select
                        defaultValue={sess.tracing ?? "inherit"}
                        className="text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded px-2 py-1 text-[var(--oc-text)]"
                      >
                        <option>inherit</option>
                        <option>on</option>
                        <option>off</option>
                      </select>
                    </td>
                    <td>
                      <select
                        defaultValue={sess.reasoning ?? "inherit"}
                        className="text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded px-2 py-1 text-[var(--oc-text)]"
                      >
                        <option>inherit</option>
                        <option>low</option>
                        <option>medium</option>
                        <option>high</option>
                      </select>
                    </td>
                    <td>
                      <button className="oc-btn-primary text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
