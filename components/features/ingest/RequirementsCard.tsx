"use client";

import { useState } from "react";
import { saveOpportunity } from "@/lib/ingest/actions";
import type { IngestResult } from "./IngestForm";

const mono  = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export function RequirementsCard({ result, onSaved }: { result: IngestResult; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  async function handleSave() {
    setSaving(true);
    const res = await saveOpportunity(result);
    setSaving(false);
    if (res?.error) { setError(res.error); return; }
    setSaved(true);
    onSaved();
  }

  return (
    <div style={{
      padding: "1.5rem",
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4,
      borderLeft: "2px solid #6BA68A",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", lineHeight: 1.2 }}>
            {result.title}
          </div>
          {result.company && (
            <div style={{ fontFamily: mono, fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {result.company}
            </div>
          )}
        </div>
        {result.required_years_experience > 0 && (
          <span style={{ fontFamily: mono, fontSize: 10, color: "#6BA68A", whiteSpace: "nowrap", paddingTop: 2 }}>
            {result.required_years_experience}+ YRS
          </span>
        )}
      </div>

      {result.prioritized_acronyms.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
            TECH STACK (by frequency)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {result.prioritized_acronyms.map((a, i) => (
              <span key={a} style={{
                fontFamily: mono, fontSize: 10, padding: "0.25rem 0.6rem",
                background: "rgba(107,166,138,0.08)", border: "1px solid rgba(107,166,138,0.2)",
                borderRadius: 2, color: "#6BA68A",
                opacity: Math.max(0.4, 1 - i * 0.07),
              }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {result.signals.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
            KEY SIGNALS
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {result.signals.map((s, i) => (
              <li key={i} style={{ fontFamily: mono, fontSize: 11, color: "var(--text-muted)", marginBottom: "0.3rem", lineHeight: 1.6 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={handleSave} disabled={saving || saved}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: 3,
            background: saved ? "var(--green)" : saving ? "var(--border)" : "var(--amber)",
            color: saved || saving ? "var(--text-muted)" : "#070707",
            border: "none", fontFamily: mono, fontSize: 10, letterSpacing: "0.1em",
            cursor: saved || saving ? "not-allowed" : "pointer",
          }}
        >
          {saved ? "SAVED" : saving ? "SAVING..." : "SAVE TO LIBRARY"}
        </button>
        <a href={result.url} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: mono, fontSize: 9.5, color: "var(--text-dim)", textDecoration: "none" }}>
          VIEW ORIGINAL ↗
        </a>
        {error && <span style={{ fontFamily: mono, fontSize: 10, color: "var(--red)" }}>{error}</span>}
      </div>
    </div>
  );
}
