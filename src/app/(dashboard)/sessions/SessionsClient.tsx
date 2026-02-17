"use client";

import { useState, useEffect } from "react";

type Session = {
  id: string;
  channel?: string;
  lastMessageAt?: string;
  status?: string;
};

type Props = {
  tenantId: string;
};

export default function SessionsClient({ tenantId }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSessions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/openclaw/sessions");
      if (!res.ok) throw new Error("Failed to load sessions");
      const data = (await res.json()) as { sessions: Session[] };
      setSessions(data.sessions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="oc-card">
        <p className="text-sm text-[var(--oc-muted)]">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oc-card border border-red-500/50" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="oc-card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--oc-muted)]">
          {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={loadSessions}
          className="oc-btn-ghost text-xs"
        >
          Refresh
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-sm text-[var(--oc-muted)]">
          No active sessions. Sessions will appear here when users interact with channels.
        </p>
      ) : (
        <div className="oc-table-wrap">
          <table className="oc-table w-full">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Channel</th>
                <th>Last message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-[11px] text-[var(--oc-text)]">
                    {s.id}
                  </td>
                  <td className="text-[var(--oc-text)]">
                    {s.channel || "unknown"}
                  </td>
                  <td className="text-[var(--oc-muted)]">
                    {s.lastMessageAt
                      ? new Date(s.lastMessageAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <span className={`oc-pill ${s.status === "active" ? "ok" : "off"}`}>
                      {s.status || "unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
