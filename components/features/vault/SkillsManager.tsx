"use client";

import { useState } from "react";
import { addSkill, deleteSkill } from "@/lib/vault/actions";
import type { Skill } from "@/types/database";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("name", input.trim());
    const result = await addSkill(fd);
    setSaving(false);
    if (result?.error) { setError(result.error); return; }
    setInput("");
    setError("");
  }

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g. TypeScript"
          style={{
            flex: 1, padding: "0.5rem 0.75rem",
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 3, color: "var(--text)", fontFamily: mono, fontSize: 12, outline: "none",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = "var(--amber)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        <button type="submit" disabled={saving || !input.trim()}
          style={{
            padding: "0.5rem 1rem", borderRadius: 3,
            background: "var(--amber)", color: "#070707",
            border: "none", fontFamily: mono, fontSize: 10,
            letterSpacing: "0.08em", cursor: "pointer",
          }}>
          + ADD
        </button>
      </form>

      {error && <p style={{ fontFamily: mono, fontSize: 10, color: "var(--red)", marginBottom: "0.75rem" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {skills.map(skill => (
          <span key={skill.id} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.3rem 0.75rem",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 3, fontFamily: mono, fontSize: 11, color: "var(--text-muted)",
          }}>
            {skill.name}
            <button
              onClick={() => deleteSkill(skill.id)}
              style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 0, lineHeight: 1 }}
              aria-label={`Remove ${skill.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span style={{ fontFamily: mono, fontSize: 11, color: "var(--text-dim)" }}>
            No skills added yet.
          </span>
        )}
      </div>
    </div>
  );
}
