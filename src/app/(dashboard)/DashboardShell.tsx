"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardShell({
  children,
  sessionEmail,
  tenantId,
}: {
  children: React.ReactNode;
  sessionEmail: string;
  tenantId: string;
}) {
  const pathname = usePathname();

  return (
    <div className="oc-shell">
      <header className="oc-topbar">
        <div className="flex items-center gap-3">
          <span className="oc-brand-title">OpenClaw</span>
          <span className="oc-brand-sub">Control</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--oc-muted)] font-mono">
            {tenantId}
          </span>
          <form action="/api/auth/logout" method="POST" className="inline-flex">
            <button type="submit" className="oc-btn-ghost">
              Log out
            </button>
          </form>
        </div>
      </header>

      <nav className="oc-nav">
        <div className="mb-4">
          <div className="px-2 py-1 text-[11px] font-medium text-[var(--oc-muted)] uppercase tracking-wider">
            Control
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`oc-nav-item ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="oc-content">{children}</main>
    </div>
  );
}
