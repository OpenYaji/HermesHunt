"use client";

import { useState } from "react";
import { validateJobUrl } from "@/lib/ingest/validation";

const mono = "var(--font-jetbrains), ui-monospace, monospace";

export type IngestResult = {
  title: string;
  company: string;
  url: string;
  required_years_experience: number;
  prioritized_acronyms: string[];
  signals: string[];
  extracted_at: string;
};

export function IngestForm({ onResult }: { onResult: (r: IngestResult) => void }) {
  const [url, setUrl]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateJobUrl(url);
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/ingest/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Request failed" }));
      setError(data.error ?? "Scrape failed");
      return;
    }

    const result: IngestResult = await res.json();
    setUrl("");
    onResult(result);
  }

  const borderColor = error ? "var(--red)" : "var(--border)";

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <input
            type="text" value={url} onChange={e => { setUrl(e.target.value); setError(""); }}
            placeholder="https://jobs.lever.co/acme/... or greenhouse.io/..."
            style={{
              width: "100%", padding: "0.625rem 0.875rem",
              background: "var(--bg)", border: `1px solid ${borderColor}`,
              borderRadius: 3, color: "var(--text)", fontFamily: mono, fontSize: 12, outline: "none",
            }}
            onFocus={e => { if (!error) e.currentTarget.style.borderColor = "var(--amber)"; }}
            onBlur={e => { if (!error) e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          {error && (
            <p style={{ fontFamily: mono, fontSize: 10, color: "var(--red)", marginTop: "0.35rem", marginBottom: 0 }}>
              {error}
            </p>
          )}
        </div>
        <button
          type="submit" disabled={loading || !url.trim()}
          style={{
            padding: "0.625rem 1.25rem", borderRadius: 3, whiteSpace: "nowrap",
            background: loading ? "var(--border)" : "var(--amber)",
            color: loading ? "var(--text-muted)" : "#070707",
            border: "none", fontFamily: mono, fontSize: 10,
            letterSpacing: "0.1em", cursor: loading || !url.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "SCANNING..." : "SCAN URL"}
        </button>
      </div>
    </form>
  );
}
