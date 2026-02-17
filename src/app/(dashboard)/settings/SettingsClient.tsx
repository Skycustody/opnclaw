"use client";

import { useState, useEffect } from "react";

type Channels = {
  telegram: {
    enabled: boolean;
    pairingCode?: string;
  };
  whatsapp: { enabled: boolean };
  discord: { enabled: boolean };
  slack: { enabled: boolean };
  signal: { enabled: boolean };
};

type Props = {
  initialChannels: Channels;
  initialModel: string;
};

const MODEL_OPTIONS: { id: string; label: string }[] = [
  { id: "gpt-4.1-mini", label: "GPT‑4.1 mini (fast, cheap)" },
  { id: "gpt-4.1", label: "GPT‑4.1 (balanced)" },
  { id: "gpt-4.1-preview", label: "GPT‑4.1 preview" },
];

export default function SettingsClient({
  initialChannels,
  initialModel,
}: Props) {
  const [channels, setChannels] = useState<Channels>(initialChannels);
  const [model, setModel] = useState<string>(initialModel);
  const [pairingCode, setPairingCode] = useState<string | undefined>(
    initialChannels.telegram.pairingCode,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPairingCode(initialChannels.telegram.pairingCode);
  }, [initialChannels.telegram.pairingCode]);

  async function updateConfig(partial: {
    telegramEnabled?: boolean;
    whatsappEnabled?: boolean;
    discordEnabled?: boolean;
    slackEnabled?: boolean;
    signalEnabled?: boolean;
    model?: string;
  }) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/openclaw/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update settings");
      }
      const data = (await res.json()) as {
        channels: Channels;
        model: string;
        telegramPairingCode?: string;
      };
      setChannels(data.channels);
      setModel(data.model);
      setPairingCode(data.telegramPairingCode);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="oc-card">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
          Default model
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-3">
          Primary model for your assistant. Toggle and pair channels below.
        </p>
        <select
          className="w-full max-w-xs rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] px-3 py-2 text-sm text-[var(--oc-text)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-accent)]"
          value={model}
          disabled={saving}
          onChange={(e) => updateConfig({ model: e.target.value })}
        >
          {MODEL_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      <section className="oc-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-1">
              Telegram
            </h2>
            <p className="text-sm text-[var(--oc-muted)]">
              Connect a Telegram bot. Pairing code is stored per tenant.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              updateConfig({ telegramEnabled: !channels.telegram.enabled })
            }
            className={`oc-pill ${channels.telegram.enabled ? "ok" : "off"}`}
            style={{ cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "…" : channels.telegram.enabled ? "Disable" : "Enable"}
          </button>
        </div>
        {channels.telegram.enabled && (
          <div
            className="mt-4 rounded-[var(--oc-radius-lg)] border border-[var(--oc-ok)] p-3 text-sm"
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              color: "var(--oc-text)",
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
              Pairing
            </p>
            {pairingCode ? (
              <p className="font-mono text-[var(--oc-text-strong)] tracking-widest">
                {pairingCode}
              </p>
            ) : (
              <p className="text-[var(--oc-muted)]">Code will appear after save.</p>
            )}
          </div>
        )}
      </section>

      <section className="oc-card">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-2">
          Other channels
        </h2>
        <p className="text-sm text-[var(--oc-muted)] mb-4">
          Toggles are stored in your tenant config; wire to OpenClaw gateway as needed.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChannelToggle
            label="WhatsApp"
            enabled={channels.whatsapp.enabled}
            saving={saving}
            onToggle={() =>
              updateConfig({ whatsappEnabled: !channels.whatsapp.enabled })
            }
          />
          <ChannelToggle
            label="Discord"
            enabled={channels.discord.enabled}
            saving={saving}
            onToggle={() =>
              updateConfig({ discordEnabled: !channels.discord.enabled })
            }
          />
          <ChannelToggle
            label="Slack"
            enabled={channels.slack.enabled}
            saving={saving}
            onToggle={() =>
              updateConfig({ slackEnabled: !channels.slack.enabled })
            }
          />
          <ChannelToggle
            label="Signal"
            enabled={channels.signal.enabled}
            saving={saving}
            onToggle={() =>
              updateConfig({ signalEnabled: !channels.signal.enabled })
            }
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

function ChannelToggle({
  label,
  enabled,
  saving,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  saving: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onToggle}
      className={`flex items-center justify-between rounded-[var(--oc-radius-lg)] border px-3 py-2 text-left text-sm transition ${
        enabled
          ? "border-[var(--oc-ok)] bg-[rgba(34,197,94,0.08)] text-[var(--oc-text)]"
          : "border-[var(--oc-border)] bg-[var(--oc-card)] text-[var(--oc-muted)] hover:bg-[var(--oc-bg-elevated)]"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className={`oc-pill ${enabled ? "ok" : "off"}`}>
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}
