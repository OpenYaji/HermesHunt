import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExperiencesList } from "@/components/features/vault/ExperiencesList";
import { ProjectsList }    from "@/components/features/vault/ProjectsList";
import { SkillsManager }   from "@/components/features/vault/SkillsManager";
import type { Experience, Project, Skill } from "@/types/database";

const mono  = "var(--font-jetbrains), ui-monospace, monospace";
const serif = "var(--font-playfair), Georgia, serif";

export default async function VaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: experiences }, { data: projects }, { data: skills }] = await Promise.all([
    supabase.from("experiences").select("*").eq("profile_id", user.id).order("sort_order"),
    supabase.from("projects").select("*").eq("profile_id", user.id).order("sort_order"),
    supabase.from("skills").select("*").eq("profile_id", user.id).order("created_at"),
  ]);

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "var(--amber)", marginBottom: "0.75rem" }}>
        01 · VAULT
      </div>
      <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: "2.5rem", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
        Master Profile
      </h1>
      <p style={{ fontFamily: mono, fontSize: 12, color: "var(--text-muted)", margin: "0 0 3rem", lineHeight: 1.8 }}>
        Your Single Source of Truth. Every experience, project, and skill — structured for machine consumption.
      </p>

      <VaultSection title="Experiences" count={experiences?.length ?? 0} accent="#D4A853">
        <ExperiencesList experiences={(experiences ?? []) as Experience[]} />
      </VaultSection>

      <VaultSection title="Projects" count={projects?.length ?? 0} accent="#6BA68A">
        <ProjectsList projects={(projects ?? []) as Project[]} />
      </VaultSection>

      <VaultSection title="Skills" count={skills?.length ?? 0} accent="#8A7AC8">
        <SkillsManager skills={(skills ?? []) as Skill[]} />
      </VaultSection>
    </div>
  );
}

function VaultSection({ title, count, accent, children }: {
  title: string; count: number; accent: string; children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "3rem", paddingBottom: "3rem", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: accent, margin: 0 }}>
          {title.toUpperCase()}
        </h2>
        <span style={{ fontFamily: mono, fontSize: 9, color: "var(--text-dim)" }}>
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      </div>
      {children}
    </section>
  );
}
