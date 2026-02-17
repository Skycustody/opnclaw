import { getOpenClawInstances } from "@/lib/openclaw";

export default async function InstancesPage() {
  const instances = await getOpenClawInstances().catch(() => []);

  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Instances</h1>
        <p className="oc-page-sub">
          Presence beacons from connected clients and nodes.
        </p>
      </div>

      <section className="oc-card">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
          Connected Instances
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Presence beacons from the gateway and clients.
        </p>

        {instances.length === 0 ? (
          <p className="text-sm text-[var(--oc-muted)]">
            No instances connected.
          </p>
        ) : (
          <div className="space-y-3">
            {instances.map((inst) => (
              <div
                key={inst.id}
                className="oc-card"
                style={{ background: "var(--oc-bg-elevated)", padding: "12px" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-[var(--oc-text-strong)] mb-1">
                      {inst.id}
                    </div>
                    <div className="text-xs text-[var(--oc-muted)] mb-2">
                      {inst.ip} | {inst.role}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {inst.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-[var(--oc-bg)] border border-[var(--oc-border)] text-[var(--oc-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--oc-muted)]">
                    <div>just now</div>
                    <div className="mt-1">Live stream</div>
                    <button className="oc-btn-ghost mt-2 text-xs">Refresh</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
