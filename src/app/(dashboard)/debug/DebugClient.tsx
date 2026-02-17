"use client";

import { useState } from "react";

type Props = {
  tenantId: string;
};

export default function DebugClient({ tenantId }: Props) {
  const [rpcResult, setRpcResult] = useState<string>("");
  const [rpcLoading, setRpcLoading] = useState(false);
  const [rpcMethod, setRpcMethod] = useState("status");
  const [rpcParams, setRpcParams] = useState("{}");

  async function callRpc() {
    setRpcLoading(true);
    setRpcResult("");
    try {
      // This would call OpenClaw gateway RPC
      // For now, just show a placeholder
      setRpcResult(JSON.stringify({ method: rpcMethod, params: JSON.parse(rpcParams) }, null, 2));
    } catch (err: unknown) {
      setRpcResult(err instanceof Error ? err.message : "Error");
    } finally {
      setRpcLoading(false);
    }
  }

  return (
    <div className="oc-card">
      <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--oc-muted)] mb-3">
        RPC Call
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--oc-muted)] mb-1">
            Method
          </label>
          <input
            type="text"
            value={rpcMethod}
            onChange={(e) => setRpcMethod(e.target.value)}
            className="w-full rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] px-3 py-2 text-sm text-[var(--oc-text)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-accent)]"
            placeholder="status"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--oc-muted)] mb-1">
            Params (JSON)
          </label>
          <textarea
            value={rpcParams}
            onChange={(e) => setRpcParams(e.target.value)}
            className="w-full rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] p-2 font-mono text-[11px] text-[var(--oc-text)] focus:outline-none focus:ring-2 focus:ring-[var(--oc-accent)]"
            rows={3}
          />
        </div>
        <button
          onClick={callRpc}
          disabled={rpcLoading}
          className="oc-btn-primary"
        >
          {rpcLoading ? "Calling..." : "Call RPC"}
        </button>
        {rpcResult && (
          <div className="rounded-[var(--oc-radius)] border border-[var(--oc-border)] bg-[var(--oc-bg-elevated)] p-3 font-mono text-[11px] text-[var(--oc-text)] whitespace-pre-wrap">
            {rpcResult}
          </div>
        )}
      </div>
    </div>
  );
}
