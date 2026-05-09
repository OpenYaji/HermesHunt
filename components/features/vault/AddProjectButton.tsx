"use client";

import { useState } from "react";
import { ProjectForm } from "./ProjectForm";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export function AddProjectButton() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div style={{
        padding: "1.5rem", marginTop: "0.75rem",
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4,
      }}>
        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.15em", color: "var(--amber)", marginBottom: "1rem" }}>
          NEW PROJECT
        </div>
        <ProjectForm onClose={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <button onClick={() => setOpen(true)} style={{
      marginTop: "0.75rem", padding: "0.625rem 1.25rem",
      background: "transparent", color: "var(--text-muted)",
      border: "1px dashed var(--border)", borderRadius: 4,
      fontFamily: mono, fontSize: 10, letterSpacing: "0.1em",
      cursor: "pointer", width: "100%",
    }}>
      + ADD PROJECT
    </button>
  );
}
