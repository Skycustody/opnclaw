export default function UsagePage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Usage</h1>
        <p className="oc-page-sub">
          See where tokens go, where sessions occur, and what resources used.
        </p>
      </div>

      <section className="oc-card mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button className="oc-btn-primary text-xs">Today</button>
            <button className="oc-btn-ghost text-xs">7d</button>
            <button className="oc-btn-ghost text-xs">30d</button>
            <input
              type="text"
              defaultValue="17.02.2026"
              className="w-24 px-2 py-1 text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
            <span className="text-[var(--oc-muted)]">—</span>
            <input
              type="text"
              defaultValue="17.02.2026"
              className="w-24 px-2 py-1 text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
            <select className="text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded px-2 py-1 text-[var(--oc-text)]">
              <option>Local</option>
            </select>
            <button className="oc-btn-primary text-xs">Tokens</button>
            <button className="oc-btn-ghost text-xs">Cost</button>
            <button className="oc-btn-primary text-xs">Refresh</button>
          </div>
          <button className="oc-btn-ghost text-xs">Export</button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Filter sessions (e.g. key:agent.main.cron model:gpt_4a has:errors minTokens:2000)"
            className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
          />
        </div>
        <p className="text-xs text-[var(--oc-muted)] mb-3">
          Tip: use filters or click here to filter days.
        </p>
        <div className="text-xs text-[var(--oc-muted)] mb-2">
          Filter (client-side)
        </div>
        <div className="text-xs text-[var(--oc-muted)] mb-4">
          0 sessions in range
        </div>
        <div className="text-2xl font-bold text-[var(--oc-text-strong)]">
          0 tokens
        </div>
      </section>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
            Activity by Time
          </h2>
          <p className="text-sm text-[var(--oc-muted)]">No timeline data yet.</p>
        </section>

        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
            Daily Usage
          </h2>
          <p className="text-sm text-[var(--oc-muted)]">No data</p>
        </section>

        <section className="oc-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)]">
              Sessions
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--oc-accent)]">Recently viewed</span>
              <select className="text-xs bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded px-2 py-1 text-[var(--oc-text)]">
                <option>Sort Recent</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-[var(--oc-muted)]">No sessions in range</p>
        </section>
      </div>
    </>
  );
}
