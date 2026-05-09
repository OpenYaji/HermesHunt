"use client";

import { deleteOpportunity } from "@/lib/ingest/actions";
import type { JobOpportunity } from "@/types/database";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

const STATUS_COLORS: Record<string, string> = {
  new:        "#8A8070",
  translated: "#8A7AC8",
  applied:    "#6BA68A",
  rejected:   "#C05A4A",
};

export function OpportunitiesList({ opportunities }: { opportunities: JobOpportunity[] }) {
  if (opportunities.length === 0) {
    return (
      <p style={{ fontFamily: mono, fontSize: 11, color: "var(--text-dim)" }}>
        No opportunities saved yet. Paste a job URL above to get started.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {opportunities.map(opp => (
        <div key={opp.id} style={{
          padding: "1rem 1.25rem",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem",
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: 12, color: "var(--text)", marginBottom: 2 }}>
              {opp.title}
            </div>
            {opp.company && (
              <div style={{ fontFamily: mono, fontSize: 10, color: "var(--text-muted)" }}>
                {opp.company}
              </div>
            )}
            <a href={opp.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: mono, fontSize: 9, color: "var(--text-dim)",
                textDecoration: "none", display: "block", marginTop: 4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
              {opp.url}
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {opp.required_years_experience > 0 && (
              <span style={{ fontFamily: mono, fontSize: 9, color: "#6BA68A" }}>
                {opp.required_years_experience}+ yrs
              </span>
            )}
            <span style={{
              fontFamily: mono, fontSize: 9, padding: "0.2rem 0.5rem",
              background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2,
              color: STATUS_COLORS[opp.status] ?? "var(--text-dim)",
              textTransform: "uppercase" as const,
            }}>
              {opp.status}
            </span>
            <form action={deleteOpportunity.bind(null, opp.id)}>
              <button type="submit"
                style={{ fontFamily: mono, fontSize: 9, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}>
                REMOVE
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
