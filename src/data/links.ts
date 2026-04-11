/**
 * Shared types and profile content for the public page.
 * Link rows are loaded from Supabase (`links` table); the static list below was removed to avoid drift.
 */
import { site } from "@/lib/site";

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  icon?: string;
  description?: string;
}

export const profile = {
  name: site.personName,
  greeting: "Hey, I'm Safan!",
  title: "Software Engineer & NASA Patent Co-Inventor",
  skills: ["Full-Stack Engineering", "AI & LLM Systems", "Cloud Architecture"],
  bio: "I build innovative solutions for complex technical challenges, with a focus on scalable and impactful results!",
  avatarUrl: "/avatar.jpeg",
};
