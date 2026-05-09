"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const mono = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleMagicLink() {
    if (!email) { setError("Enter your email first."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setError("Check your email for the magic link.");
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
          Sign in
        </h1>
      </div>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
            EMAIL
          </label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            required autoComplete="email"
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

        <div>
          <label style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
            PASSWORD
          </label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password"
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

        {error && (
          <p style={{ fontFamily: mono, fontSize: 11, color: error.includes("Check") ? "var(--green)" : "var(--red)", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            padding: "0.75rem", borderRadius: 3,
            background: loading ? "var(--border)" : "var(--amber)",
            color: loading ? "var(--text-muted)" : "#070707",
            border: "none", fontFamily: mono, fontSize: 11,
            letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
          }}
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <button
          type="button" onClick={handleMagicLink} disabled={loading}
          style={{
            padding: "0.625rem", borderRadius: 3,
            background: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--border)", fontFamily: mono,
            fontSize: 10, letterSpacing: "0.1em", cursor: "pointer",
          }}
        >
          SEND MAGIC LINK
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", fontFamily: mono, fontSize: 10, color: "var(--text-dim)", textAlign: "center" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "var(--amber)", textDecoration: "none" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
