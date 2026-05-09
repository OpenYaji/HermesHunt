import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

const NAV_ITEMS = [
  { code: "01", label: "Vault",     href: "/dashboard/vault",     accent: "#D4A853" },
  { code: "02", label: "Ingest",    href: "/dashboard/ingest",    accent: "#6BA68A" },
  { code: "03", label: "Translate", href: "/dashboard/translate", accent: "#8A7AC8" },
  { code: "04", label: "Output",    href: "/dashboard/output",    accent: "#C88A6A" },
  { code: "05", label: "Execute",   href: "/dashboard/execute",   accent: "#6A98C8" },
  { code: "06", label: "HITL",      href: "/dashboard/hitl",      accent: "#7AC87A" },
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        padding: "1.5rem 0",
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto",
      }}>
        <div style={{ padding: "0 1.25rem", marginBottom: "2rem" }}>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: "var(--text)" }}>
            HERMES<span style={{ color: "var(--amber)" }}>HUNT</span>
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem", flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.code}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.6rem 1.25rem",
                textDecoration: "none", color: "var(--text-muted)",
                borderLeft: "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 9, color: item.accent }}>
                {item.code}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.06em" }}>
                {item.label.toUpperCase()}
              </span>
            </Link>
          ))}
        </nav>

        {/* User + signout */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
          <p style={{ fontFamily: mono, fontSize: 9.5, color: "var(--text-dim)", margin: "0 0 0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.email}
          </p>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.1em",
                padding: "0.4rem 0.75rem", borderRadius: 2,
                background: "transparent", color: "var(--text-dim)",
                border: "1px solid var(--border)", cursor: "pointer",
              }}
            >
              SIGN OUT
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2.5rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
