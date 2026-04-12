"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FaRocket, FaRobot, FaCode, FaCalculator } from "react-icons/fa";

const projects = [
  {
    title: "AI Prompt Generation & MCP Server",
    year: "2025",
    description:
      "A CLI tool and MCP server for AI-powered code analysis. Point it at any codebase to generate structured prompts for debugging and refactoring — or give Claude Desktop direct access to inspect repos and git history.",
    tech: ["Python", "FastAPI", "Docker", "Gemini", "FastMCP"],
    icon: FaRobot,
    color: "#8b5cf6",
    link: "https://github.com/SafanAbbasi/GeneratePromptTool",
    linkLabel: "View Source",
  },
  {
    title: "NASA Patent",
    year: "2024",
    description:
      "Co-invented a laser-based method for triggering thermal runaway of a battery. Contributed to the core technical approach and fine-tuned testing parameters from concept through patent issuance.",
    tech: ["Research", "Engineering", "Patent"],
    icon: FaRocket,
    color: "#0d9488",
    link: "https://patents.google.com/patent/US12174259B1/en?oq=12174259",
    linkLabel: "View Patent",
  },
  {
    title: "Bookkeeping Automation",
    year: "2025",
    description:
      "An AI-powered app that parses financial statements and produces detailed reports, reducing manual bookkeeping effort by 80+ hours per client. Optimized with multi-threading and batching for a 1000% speedup.",
    tech: [],
    icon: FaCalculator,
    color: "#f59e0b",
    link: "https://www.easebook.app/about",
    linkLabel: "Learn More",
  },
  {
    title: "Personal Portfolio",
    year: "2025",
    description:
      "You're looking at it. Built from scratch with custom animations, particle effects, and an interactive timeline — plus an admin dashboard with click analytics and email replies.",
    tech: ["Next.js", "React", "Supabase", "Motion", "Tailwind"],
    icon: FaCode,
    color: "#3b82f6",
    link: "https://github.com/SafanAbbasi/safanabbasi.com",
    linkLabel: "View Source",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = project.icon;

  return (
    <motion.div
      className="group relative rounded-2xl border border-gray-200/40 bg-white/40 p-6 backdrop-blur-sm transition-shadow dark:border-white/10 dark:bg-white/5"
      style={{
        boxShadow: isHovered
          ? `0 0 30px ${project.color}30, 0 8px 32px rgba(0,0,0,0.12)`
          : "0 4px 16px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: project.color }}
        >
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <p className="text-xs text-gray-400">{project.year}</p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
          >
            {t}
          </span>
        ))}
      </div>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {project.linkLabel}
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      )}
    </motion.div>
  );
}

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-10 flex items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-white/20" />
          <div className="flex flex-col items-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Projects
            </h2>
            <span className="mt-1 font-mono text-[10px] tracking-[0.5em] uppercase text-teal-600/60 dark:text-teal-400/60">
              Selected work
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-white/20" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
