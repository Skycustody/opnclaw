"use client";

import { useState, useEffect } from "react";

type ChannelsResponse = {
  channels: {
    telegram: {
      enabled: boolean;
      pairingCode?: string;
    };
  };
};

type Props = {
  initial: ChannelsResponse["channels"];
};

export default function SettingsClient({ initial }: Props) {
  const [channels, setChannels] = useState(initial);
  const [pairingCode, setPairingCode] = useState<string | undefined>(
    initial.telegram.pairingCode,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPairingCode(initial.telegram.pairingCode);
  }, [initial.telegram.pairingCode]);

  async function toggleTelegram(enabled: boolean) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/openclaw/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegramEnabled: enabled }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update Telegram channel");
      }

      const data = (await res.json()) as {
        channels: ChannelsResponse["channels"];
        telegramPairingCode?: string;
      };

      setChannels(data.channels);
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
            onClick={() => toggleTelegram(!channels.telegram.enabled)}
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
                On your VPS where OpenClaw runs, set{" "}
                <code className="rounded bg-emerald-900/40 px-1 py-0.5 font-mono text-[10px]">
                  OPENCLAW_CONFIG_PATH
                </code>{" "}
                to this tenant&apos;s config file (created by this UI).
              </li>
              <li>
                In your OpenClaw gateway, use this pairing code when enabling
                the Telegram integration for this tenant:
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

        {error && (
          <p className="mt-3 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </section>
    </div>
  );
}

