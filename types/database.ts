export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          email?: string | null;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          profile_id: string;
          role: string;
          company: string;
          start_date: string;
          end_date: string;
          bullets: string[];
          tech_stack: string[];
          metrics: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          role: string;
          company: string;
          start_date: string;
          end_date: string;
          bullets?: string[];
          tech_stack?: string[];
          metrics?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: string;
          company?: string;
          start_date?: string;
          end_date?: string;
          bullets?: string[];
          tech_stack?: string[];
          metrics?: string[];
          sort_order?: number;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          description: string;
          tech_stack: string[];
          metrics: string[];
          url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          description?: string;
          tech_stack?: string[];
          metrics?: string[];
          url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          tech_stack?: string[];
          metrics?: string[];
          url?: string | null;
          sort_order?: number;
        };
      };
      skills: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          category?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: string;
        };
      };
    };
  };
}

// Convenience row types
export type Profile    = Database["public"]["Tables"]["profiles"]["Row"];
export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type Project    = Database["public"]["Tables"]["projects"]["Row"];
export type Skill      = Database["public"]["Tables"]["skills"]["Row"];
