"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Control",
    items: [
      { href: "/dashboard", label: "Overview" },
      { href: "/channels", label: "Channels" },
      { href: "/instances", label: "Instances" },
      { href: "/sessions", label: "Sessions" },
      { href: "/usage", label: "Usage" },
      { href: "/cron", label: "Cron Jobs" },
    ],
  },
  {
    label: "Agent",
    items: [
      { href: "/agents", label: "Agents" },
      { href: "/skills", label: "Skills" },
      { href: "/nodes", label: "Nodes" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/settings", label: "Config" },
      { href: "/debug", label: "Debug" },
      { href: "/logs", label: "Logs" },
    ],
  },
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
          <button className="oc-nav-toggle" aria-label="Toggle navigation">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <span className="oc-brand-title">OPENCLAW</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="oc-health-status">
            <span className="oc-health-dot"></span>
            Health: OK
          </span>
        </div>
      </header>

      <nav className="oc-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="oc-nav-group">
            <div className="oc-nav-label">{group.label}</div>
            <div className="oc-nav-items">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`oc-nav-item ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <main className="oc-content">{children}</main>
    </div>
  );
}
