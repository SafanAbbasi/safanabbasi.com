/**
 * Single source of truth for public site identity, URLs, and repeated marketing copy.
 * Import from server components, route handlers, and client components (constants only).
 */
export const site = {
  canonicalUrl: "https://www.safanabbasi.com",
  /** Shown in UI where a short hostname reads well (short links, email subjects). */
  displayHost: "safanabbasi.com",
  personName: "Safan Abbasi",
  jobTitle: "Software Engineer",
  /** Default meta / OG / JSON-LD description */
  description:
    "Full-Stack Software Engineer & NASA Patent Co-Inventor. Building scalable solutions with AI, cloud architecture, and modern web technologies.",
  /** One-line subtitle used in OG image and similar */
  ogSubtitle: "Software Engineer & NASA Patent Co-Inventor",
  /** Skills line in OG image */
  ogSkillsLine:
    "Full-Stack Engineering • AI & LLM Systems • Cloud Architecture",
  pageTitle: "Safan Abbasi — Software Engineer",
  /** Shown as “From:” in admin message replies (matches typical Resend from-domain) */
  contactEmail: "contact@safanabbasi.com",
  sameAs: [
    "https://github.com/SafanAbbasi",
    "https://linkedin.com/in/safanabbasi",
  ] as const,
  knowsAbout: [
    "Full-Stack Development",
    "AI & LLM Systems",
    "Cloud Architecture",
    "Python",
    "C#",
    ".NET",
    "React",
    "TypeScript",
    "Azure",
    "AWS",
    "Docker",
    "Kubernetes",
  ] as const,
  credentials: [
    "AZ-104 Azure Administrator",
    "AI-900 AI Fundamentals",
    "AZ-900 Azure Fundamentals",
    "AWS Cloud Practitioner",
  ] as const,
  googleSiteVerification: "C7rvR625RScm8kL9IxcgsZLKLz3Jb-icDZsZRFnb2zw",
} as const;

export function absoluteSiteUrl(path = ""): string {
  const base = site.canonicalUrl.replace(/\/$/, "");
  if (!path) return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
