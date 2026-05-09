const mono = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export default function DashboardPage() {
  return (
    <div>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "var(--amber)", marginBottom: "0.75rem" }}>
        DASHBOARD
      </div>
      <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "2.5rem", margin: "0 0 1rem", lineHeight: 1.1 }}>
        Welcome back.
      </h1>
      <p style={{ fontFamily: mono, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8 }}>
        Start with the Vault — build your Master Profile before ingesting any jobs.
      </p>
    </div>
  );
}
