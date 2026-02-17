"use client";

import { useState, useEffect } from "react";

type Channels = {
  telegram: { enabled: boolean; pairingCode?: string };
  whatsapp: { enabled: boolean };
  discord: { enabled: boolean };
  slack: { enabled: boolean };
  signal: { enabled: boolean };
};

type Props = {
  initialChannels: Channels;
};

export default function ChannelsClient({ initialChannels }: Props) {
  const [channels, setChannels] = useState<Channels>(initialChannels);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleChannel(
    channel: keyof Channels,
    enabled: boolean,
  ) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/openclaw/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [`${channel}Enabled`]: enabled,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update channel");
      }
      const data = (await res.json()) as { channels: Channels };
      setChannels(data.channels);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const channelList = [
    { key: "telegram" as const, label: "Telegram", icon: "📱" },
    { key: "whatsapp" as const, label: "WhatsApp", icon: "💬" },
    { key: "discord" as const, label: "Discord", icon: "🎮" },
    { key: "slack" as const, label: "Slack", icon: "💼" },
    { key: "signal" as const, label: "Signal", icon: "🔒" },
  ];

  return (
    <div className="space-y-4">
      {channelList.map(({ key, label, icon }) => {
        const channel = channels[key];
        const enabled = channel?.enabled ?? false;
        return (
          <div key={key} className="oc-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--oc-text-strong)] mb-1">
                    {label}
                  </h3>
                  <p className="text-xs text-[var(--oc-muted)]">
                    {enabled
                      ? "Channel is enabled for this tenant"
                      : "Channel is disabled"}
                  </p>
                  {key === "telegram" &&
                    enabled &&
                    channel.pairingCode && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-[var(--oc-radius)] border border-[var(--oc-ok)] px-2 py-1 text-[11px] font-mono" style={{ background: "rgba(34, 197, 94, 0.08)" }}>
                        <span className="text-[var(--oc-muted)]">Pairing:</span>
                        <span className="text-[var(--oc-text-strong)] tracking-wider">
                          {channel.pairingCode}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => toggleChannel(key, !enabled)}
                className={`oc-pill ${enabled ? "ok" : "off"}`}
                style={{ cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "…" : enabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        );
      })}
      {error && (
        <div className="oc-card border border-red-500/50" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
