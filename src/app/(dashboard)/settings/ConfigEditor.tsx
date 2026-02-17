"use client";

import { useState } from "react";
import type { TenantConfig } from "@/lib/tenant";

type Props = {
  initialConfig: TenantConfig;
};

export default function ConfigEditor({ initialConfig }: Props) {
  const [config, setConfig] = useState(JSON.stringify(initialConfig, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function saveConfig() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      let parsed;
      try {
        parsed = JSON.parse(config);
      } catch {
        throw new Error("Invalid JSON");
      }
      const res = await fetch("/api/openclaw/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: parsed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save config");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="oc-card">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--oc-muted)]">
            Edit tenant configuration JSON. Changes are saved immediately.
          </p>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="oc-btn-primary"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="w-full rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] p-3 font-mono text-[12px] text-[var(--oc-text)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-accent)]"
          rows={20}
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-xs text-[var(--oc-ok)]">Config saved successfully</p>
        )}
      </div>
    </div>
  );
}
