import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSessionValue } from "@/lib/auth";
import { getTenantIdFromEmail } from "@/lib/tenant";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("oc_session")?.value ?? null;
  const session = parseSessionValue(raw);
  if (!session) {
    redirect("/login");
  }
  const tenantId = getTenantIdFromEmail(session.email);

  return (
    <DashboardShell
      sessionEmail={session.email}
      tenantId={tenantId}
    >
      {children}
    </DashboardShell>
  );
}
