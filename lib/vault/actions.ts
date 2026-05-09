"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateExperience, validateProject, validateSkillName } from "./validation";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

// ── Experience CRUD ───────────────────────────────────────────────
export async function createExperience(formData: FormData) {
  const { supabase, userId } = await getAuthUser();

  const data = {
    role:       String(formData.get("role") ?? ""),
    company:    String(formData.get("company") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date:   String(formData.get("end_date") ?? ""),
  };
  const errors = validateExperience(data);
  if (Object.keys(errors).length) return { errors };

  const bullets    = String(formData.get("bullets") ?? "").split("\n").map(s => s.trim()).filter(Boolean);
  const tech_stack = String(formData.get("tech_stack") ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const metrics    = String(formData.get("metrics") ?? "").split("\n").map(s => s.trim()).filter(Boolean);

  const { error } = await supabase.from("experiences").insert({
    ...data, bullets, tech_stack, metrics,
    profile_id: userId,
  });

  if (error) return { errors: { _: error.message } };
  revalidatePath("/dashboard/vault");
  return { success: true };
}

export async function deleteExperience(id: string) {
  const { supabase, userId } = await getAuthUser();
  await supabase.from("experiences").delete().eq("id", id).eq("profile_id", userId);
  revalidatePath("/dashboard/vault");
}

// ── Project CRUD ──────────────────────────────────────────────────
export async function createProject(formData: FormData) {
  const { supabase, userId } = await getAuthUser();

  const data = { name: String(formData.get("name") ?? "") };
  const errors = validateProject(data);
  if (Object.keys(errors).length) return { errors };

  const tech_stack  = String(formData.get("tech_stack") ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const metrics     = String(formData.get("metrics") ?? "").split("\n").map(s => s.trim()).filter(Boolean);
  const description = String(formData.get("description") ?? "");
  const url         = String(formData.get("url") ?? "") || null;

  const { error } = await supabase.from("projects").insert({
    ...data, description, tech_stack, metrics, url,
    profile_id: userId,
  });

  if (error) return { errors: { _: error.message } };
  revalidatePath("/dashboard/vault");
  return { success: true };
}

export async function deleteProject(id: string) {
  const { supabase, userId } = await getAuthUser();
  await supabase.from("projects").delete().eq("id", id).eq("profile_id", userId);
  revalidatePath("/dashboard/vault");
}

// ── Skills ────────────────────────────────────────────────────────
export async function addSkill(formData: FormData) {
  const { supabase, userId } = await getAuthUser();
  const name     = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "general");
  const err = validateSkillName(name);
  if (err) return { error: err };

  const { error } = await supabase.from("skills").insert({ name, category, profile_id: userId });
  if (error && error.code === "23505") return { error: "Skill already added" };
  if (error) return { error: error.message };
  revalidatePath("/dashboard/vault");
  return { success: true };
}

export async function deleteSkill(id: string) {
  const { supabase, userId } = await getAuthUser();
  await supabase.from("skills").delete().eq("id", id).eq("profile_id", userId);
  revalidatePath("/dashboard/vault");
}
