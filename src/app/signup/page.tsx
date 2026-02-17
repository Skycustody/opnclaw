"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            OpenClaw Control
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create account
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Sign up to get your own personal OpenClaw tenant.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Must be at least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
