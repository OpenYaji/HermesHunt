"use client";

import { deleteExperience } from "@/lib/vault/actions";
import { AddExperienceButton } from "./AddExperienceButton";
import type { Experience } from "@/types/database";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export function ExperiencesList({ experiences }: { experiences: Experience[] }) {
  return (
    <div>
      {experiences.map(exp => (
        <div key={exp.id} style={{
          padding: "1.25rem", marginBottom: "0.75rem",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4,
          borderLeft: "2px solid #D4A853",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "var(--font-geist), sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                {exp.role}
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {exp.company} · {exp.start_date} – {exp.end_date}
              </div>
            </div>
            <form action={deleteExperience.bind(null, exp.id)}>
              <button type="submit" style={{ fontFamily: mono, fontSize: 9, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}>
                REMOVE
              </button>
            </form>
          </div>
          {exp.tech_stack.length > 0 && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {exp.tech_stack.map(t => (
                <span key={t} style={{
                  fontFamily: mono, fontSize: 9.5, padding: "0.2rem 0.5rem",
                  background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)",
                  borderRadius: 2, color: "#D4A853",
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
      <AddExperienceButton />
    </div>
  );
}
