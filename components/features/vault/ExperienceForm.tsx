"use client";

import { useState, useRef } from "react";
import { createExperience } from "@/lib/vault/actions";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

function Field({ label, name, placeholder, required, as, defaultValue }: {
  label: string; name: string; placeholder?: string; required?: boolean;
  as?: "textarea"; defaultValue?: string;
}) {
  const sharedStyle = {
    width: "100%", padding: "0.5rem 0.75rem",
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 3, color: "var(--text)",
    fontFamily: mono, fontSize: 12, outline: "none",
    resize: as === "textarea" ? "vertical" as const : undefined,
    minHeight: as === "textarea" ? 80 : undefined,
  };

  return (
    <div>
      <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
        {label}{required && <span style={{ color: "var(--amber)" }}> *</span>}
      </label>
      {as === "textarea"
        ? <textarea name={name} placeholder={placeholder} defaultValue={defaultValue} style={sharedStyle} />
        : <input type="text" name={name} placeholder={placeholder} required={required} defaultValue={defaultValue} style={sharedStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--amber)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
      }
    </div>
  );
}

export function ExperienceForm({ onClose }: { onClose: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(formRef.current!);
    const result = await createExperience(fd);
    setSaving(false);
    if (result?.errors) { setErrors(result.errors); return; }
    onClose();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
        <Field label="JOB TITLE" name="role" required placeholder="Senior Software Engineer" />
        <Field label="COMPANY"   name="company" required placeholder="Acme Corp" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
        <Field label="START DATE (MM/YYYY)" name="start_date" required placeholder="06/2022" />
        <Field label="END DATE (MM/YYYY or Present)" name="end_date" required placeholder="Present" />
      </div>
      <Field label="BULLET POINTS (one per line)" name="bullets" as="textarea"
        placeholder={"Built X using Y that achieved Z\nReduced latency by 40% via..."} />
      <Field label="TECH STACK (comma-separated)" name="tech_stack" placeholder="React, Node.js, PostgreSQL" />
      <Field label="METRICS (one per line)" name="metrics" as="textarea"
        placeholder={"Increased revenue by $2M\n40% reduction in load time"} />

      {errors._ && <p style={{ fontFamily: mono, fontSize: 11, color: "var(--red)", margin: 0 }}>{errors._}</p>}
      {Object.entries(errors).filter(([k]) => k !== "_").map(([k, v]) => (
        <p key={k} style={{ fontFamily: mono, fontSize: 11, color: "var(--red)", margin: 0 }}>{v}</p>
      ))}

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <button type="button" onClick={onClose}
          style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", padding: "0.5rem 1rem",
            background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer" }}>
          CANCEL
        </button>
        <button type="submit" disabled={saving}
          style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", padding: "0.5rem 1rem",
            background: saving ? "var(--border)" : "var(--amber)", color: "#070707",
            border: "none", borderRadius: 3, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "SAVING..." : "SAVE EXPERIENCE"}
        </button>
      </div>
    </form>
  );
}
