export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            OpenClaw Control
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Multi-tenant chat gateway
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A simple web UI where each user can connect their own chat apps
            (starting with Telegram) to your central OpenClaw gateway.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Log in to your panel
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Once logged in, you&apos;ll be able to choose your chat apps,
            follow pairing instructions, and see your sessions and logs—powered
            by the shared OpenClaw gateway on your VPS.
          </p>
        </div>
      </main>
    </div>
  );
}
