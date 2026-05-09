"use client";

import { deleteProject } from "@/lib/vault/actions";
import { AddProjectButton } from "./AddProjectButton";
import type { Project } from "@/types/database";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(proj => (
        <div key={proj.id} style={{
          padding: "1.25rem", marginBottom: "0.75rem",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4,
          borderLeft: "2px solid #6BA68A",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "var(--font-geist), sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                {proj.name}
              </div>
              {proj.description && (
                <div style={{ fontFamily: mono, fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {proj.description}
                </div>
              )}
              {proj.url && (
                <a href={proj.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: mono, fontSize: 10, color: "#6BA68A", marginTop: 2, display: "block", textDecoration: "none" }}>
                  {proj.url}
                </a>
              )}
            </div>
            <form action={deleteProject.bind(null, proj.id)}>
              <button type="submit" style={{ fontFamily: mono, fontSize: 9, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}>
                REMOVE
              </button>
            </form>
          </div>
          {proj.tech_stack.length > 0 && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {proj.tech_stack.map(t => (
                <span key={t} style={{
                  fontFamily: mono, fontSize: 9.5, padding: "0.2rem 0.5rem",
                  background: "rgba(107,166,138,0.08)", border: "1px solid rgba(107,166,138,0.2)",
                  borderRadius: 2, color: "#6BA68A",
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
      <AddProjectButton />
    </div>
  );
}
