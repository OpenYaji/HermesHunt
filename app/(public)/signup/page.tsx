"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const mono = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export default function SignupPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm your account.");
  }

  return (
    <div style={{
      width: "100%", maxWidth: 400,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 6, padding: "2.5rem",
    }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "var(--amber)", marginBottom: "0.5rem" }}>
          HERMESHUNT
        </div>
        <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "2rem", margin: 0, lineHeight: 1.1 }}>
          Create account
        </h1>
      </div>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[
          { label: "FULL NAME",           type: "text",     value: name,     setter: setName,     auto: "name" },
          { label: "EMAIL",               type: "email",    value: email,    setter: setEmail,    auto: "email" },
          { label: "PASSWORD (8+ chars)", type: "password", value: password, setter: setPassword, auto: "new-password" },
        ].map(({ label, type, value, setter, auto }) => (
          <div key={label}>
            <label style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
              {label}
            </label>
            <input
              type={type} value={value} onChange={e => setter(e.target.value)}
              required autoComplete={auto} minLength={type === "password" ? 8 : undefined}
              style={{
                width: "100%", padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 3, color: "var(--text)",
                fontFamily: mono, fontSize: 13, outline: "none",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--amber)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
          </div>
        ))}

        {message && (
          <p style={{ fontFamily: mono, fontSize: 11, color: message.includes("Check") ? "var(--green)" : "var(--red)", margin: 0 }}>
            {message}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            padding: "0.75rem", borderRadius: 3, marginTop: "0.5rem",
            background: loading ? "var(--border)" : "var(--amber)",
            color: loading ? "var(--text-muted)" : "#070707",
            border: "none", fontFamily: mono, fontSize: 11,
            letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", fontFamily: mono, fontSize: 10, color: "var(--text-dim)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--amber)", textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
