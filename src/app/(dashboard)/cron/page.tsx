export default function CronPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Cron Jobs</h1>
        <p className="oc-page-sub">
          Schedule wakeups and recurring agent runs.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
            Scheduler
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div>
              <span className="text-[var(--oc-muted)]">ENABLED:</span>
              <span className="ml-2 text-[var(--oc-text)]">Yes</span>
            </div>
            <div>
              <span className="text-[var(--oc-muted)]">JOBS:</span>
              <span className="ml-2 text-[var(--oc-text)]">0</span>
            </div>
            <div>
              <span className="text-[var(--oc-muted)]">NEXT WAKE:</span>
              <span className="ml-2 text-[var(--oc-muted)]">n/a</span>
            </div>
          </div>
          <button className="oc-btn-primary text-xs">Refresh</button>
        </section>

        <section className="oc-card">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
            New Job
          </h2>
          <p className="text-xs text-[var(--oc-muted)] mb-4">
            Create a scheduled wakeup or agent run.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                defaultValue="default"
                placeholder="Agent ID"
                className="px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
              />
              <input
                type="text"
                defaultValue="30"
                placeholder="Every"
                className="px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
              />
            </div>
            <select className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]">
              <option>Schedule: Every</option>
            </select>
            <select className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]">
              <option>Unit: Minutes</option>
            </select>
            <select className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]">
              <option>Session: Isolated</option>
            </select>
            <textarea
              placeholder="Agent message"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-[var(--oc-bg-elevated)] border border-[var(--oc-border)] rounded text-[var(--oc-text)]"
            />
            <div className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-[var(--oc-text)]">Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="rounded" />
              <span className="text-[var(--oc-text)]">Notify webhook</span>
            </div>
            <button className="oc-btn-primary w-full">Add Job</button>
          </div>
        </section>
      </div>
    </>
  );
}
