import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IngestClientSection } from "@/components/features/ingest/IngestClientSection";
import { OpportunitiesList }   from "@/components/features/ingest/OpportunitiesList";
import type { JobOpportunity } from "@/types/database";

const mono  = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export default async function IngestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: opportunities } = await supabase
    .from("job_opportunities")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "#6BA68A", marginBottom: "0.75rem" }}>
        02 · INGEST
      </div>
      <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "2.5rem", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
        Opportunity Ingestion
      </h1>
      <p style={{ fontFamily: mono, fontSize: 12, color: "var(--text-muted)", margin: "0 0 2rem", lineHeight: 1.8 }}>
        Paste a job URL. The scraper extracts the raw description. The local classifier identifies what the ATS is looking for.
      </p>

      <IngestClientSection />

      <section style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: "#6BA68A", margin: 0 }}>
            OPPORTUNITY LIBRARY
          </h2>
          <span style={{ fontFamily: mono, fontSize: 9, color: "var(--text-dim)" }}>
            {(opportunities?.length ?? 0)} saved
          </span>
        </div>
        <OpportunitiesList opportunities={(opportunities ?? []) as JobOpportunity[]} />
      </section>
    </div>
  );
}
