"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveOpportunity(requirements: {
  url: string;
  title: string;
  company: string;
  signals: string[];
  required_years_experience: number;
  prioritized_acronyms: string[];
  raw_text?: string;
  extracted_at: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("job_opportunities").insert({
    profile_id: user.id,
    url: requirements.url,
    title: requirements.title,
    company: requirements.company,
    signals: requirements.signals,
    required_years_experience: requirements.required_years_experience,
    prioritized_acronyms: requirements.prioritized_acronyms,
    raw_text: requirements.raw_text ?? "",
    extracted_at: requirements.extracted_at,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/ingest");
  return { success: true };
}

export async function deleteOpportunity(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("job_opportunities").delete().eq("id", id).eq("profile_id", user.id);
  revalidatePath("/dashboard/ingest");
}
