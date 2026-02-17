"use client";

import { useState, useEffect } from "react";

type Channels = {
  telegram: {
    enabled: boolean;
    pairingCode?: string;
  };
  whatsapp: {
    enabled: boolean;
  };
  discord: {
    enabled: boolean;
  };
  slack: {
    enabled: boolean;
  };
  signal: {
    enabled: boolean;
  };
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

export default function SettingsClient({ initialChannels, initialModel }: Props) {
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
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Default model
            </h2>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              This is the primary model your personal OpenClaw assistant will
              use. You can expose only the models you&apos;re willing to pay for
              and let users pick from that list.
            </p>
          </div>
          <select
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
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
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Telegram
            </h2>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Connect a Telegram bot to your personal OpenClaw tenant. We&apos;ll
              generate a pairing code and instructions you can follow in your
              main OpenClaw gateway.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              updateConfig({ telegramEnabled: !channels.telegram.enabled })
            }
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium transition ${
              channels.telegram.enabled
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            {saving
              ? "Saving..."
              : channels.telegram.enabled
                ? "Disable Telegram"
                : "Enable Telegram"}
          </button>
        </div>

        {channels.telegram.enabled && (
          <div className="mt-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
            <p className="font-medium uppercase tracking-[0.16em]">
              Pairing instructions
            </p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>
                On your VPS where OpenClaw runs, wire this tenant to a Telegram
                channel in your OpenClaw gateway using this code. In the
                future, you can automate this step.
              </li>
            </ol>
            {pairingCode && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-900/70 px-3 py-1.5 font-mono text-[11px] text-emerald-50">
                <span className="opacity-70">Code</span>
                <span className="font-semibold tracking-[0.2em]">
                  {pairingCode}
                </span>
              </div>
            )}
            {!pairingCode && (
              <p className="text-[11px] text-emerald-100/80">
                A pairing code will appear here once it has been generated.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Other channels
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          These toggles control the desired channels for this tenant. Today
          they write to your per-tenant config file; you can later hook them
          into real OpenClaw channel configs or automations.
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
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
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

type ChannelToggleProps = {
  label: string;
  enabled: boolean;
  saving: boolean;
  onToggle: () => void;
};

function ChannelToggle({
  label,
  enabled,
  saving,
  onToggle,
}: ChannelToggleProps) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onToggle}
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
        enabled
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-100"
          : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      }`}
    >
      <span className="text-xs font-medium">{label}</span>
      <span
        className={`inline-flex h-5 w-9 items-center rounded-full border text-[10px] font-semibold uppercase tracking-wide ${
          enabled
            ? "border-emerald-500 bg-emerald-500/90 text-emerald-50"
            : "border-zinc-400 bg-zinc-200 text-zinc-700 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100"
        }`}
      >
        <span className="mx-auto">{enabled ? "On" : "Off"}</span>
      </span>
    </button>
  );
}

