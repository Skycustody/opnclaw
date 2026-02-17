"use client";

import { useState, useEffect, useRef } from "react";

export default function LogsClient() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lines, setLines] = useState(100);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadLogs() {
    try {
      const res = await fetch(`/api/openclaw/logs?lines=${lines}`);
      if (!res.ok) throw new Error("Failed to load logs");
      const data = (await res.json()) as { logs: string[] };
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to load logs", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [lines, autoRefresh]);

  useEffect(() => {
    if (scrollRef.current && autoRefresh) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoRefresh]);

  return (
    <div className="oc-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--oc-muted)]">
            Lines:
          </label>
          <select
            value={lines}
            onChange={(e) => setLines(Number(e.target.value))}
            className="rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] px-2 py-1 text-xs text-[var(--oc-text)]"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-[var(--oc-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-[var(--oc-border)]"
            />
            Auto-refresh
          </label>
          <button onClick={loadLogs} className="oc-btn-ghost text-xs">
            Refresh
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] p-3 font-mono text-[11px] text-[var(--oc-text)] max-h-[600px] overflow-y-auto"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {loading ? (
          <p className="text-[var(--oc-muted)]">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-[var(--oc-muted)]">No logs available</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
