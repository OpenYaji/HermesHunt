"use client";

import { useState, useRef } from "react";
import { createProject } from "@/lib/vault/actions";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export function ProjectForm({ onClose }: { onClose: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createProject(new FormData(formRef.current!));
    setSaving(false);
    if (result?.errors) { setErrors(result.errors); return; }
    onClose();
  }

  const inputStyle = {
    width: "100%", padding: "0.5rem 0.75rem",
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 3, color: "var(--text)", fontFamily: mono, fontSize: 12, outline: "none",
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <div>
        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
          PROJECT NAME <span style={{ color: "var(--amber)" }}>*</span>
        </label>
        <input type="text" name="name" required placeholder="HermesHunt" style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = "var(--amber)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        {errors.name && <p style={{ fontFamily: mono, fontSize: 10, color: "var(--red)", marginTop: "0.25rem" }}>{errors.name}</p>}
      </div>
      <div>
        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
          DESCRIPTION
        </label>
        <textarea name="description" placeholder="Privacy-first job application automation..." rows={3}
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div>
        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
          TECH STACK (comma-separated)
        </label>
        <input type="text" name="tech_stack" placeholder="Next.js, Python, Supabase" style={inputStyle} />
      </div>
      <div>
        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
          METRICS (one per line)
        </label>
        <textarea name="metrics" placeholder={"10k users in 3 months\n94% ATS match score"} rows={2}
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div>
        <label style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
          URL (optional)
        </label>
        <input type="url" name="url" placeholder="https://hermeshunt.com" style={inputStyle} />
      </div>

      {errors._ && <p style={{ fontFamily: mono, fontSize: 11, color: "var(--red)", margin: 0 }}>{errors._}</p>}

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
          {saving ? "SAVING..." : "SAVE PROJECT"}
        </button>
      </div>
    </form>
  );
}
