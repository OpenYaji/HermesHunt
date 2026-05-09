// Shared TypeScript interfaces across the app.
// Supabase-generated types (npx supabase gen types) go in types/database.ts

export interface MasterProfile {
  id: string;
  userId: string;
  experiences: ExperienceUI[];
  projects: ProjectUI[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceUI {
  id: string;
  role: string;
  company: string;
  startDate: string; // MM/YYYY
  endDate: string | "Present";
  bullets: string[];
  techStack: string[];
  metrics: string[];
}

export interface ProjectUI {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  metrics: string[];
  url?: string;
}

export interface JobRequirements {
  title: string;
  company: string;
  url: string;
  signals: string[];
  requiredYearsExperience: number;
  prioritizedAcronyms: string[];
  extractedAt: string;
}

export interface TranslationResult {
  atsMatchScore: number;
  reorderedBullets: Record<string, string[]>;
  swappedTerms: Record<string, string>;
  alignedTitle: string;
}
