"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Briefcase, GraduationCap, Lightbulb, Award } from "lucide-react";

interface TimelineEntry {
  type: "work" | "education" | "project" | "patent";
  title: string;
  org: string;
  date: string;
  bullets: string[];
}

const timeline: TimelineEntry[] = [
  {
    type: "work",
    title: "Full-Stack Software Engineer",
    org: "Chevron",
    date: "2023 — Present",
    bullets: [
      "Architected an enterprise RAG pipeline integrating Confluence API with vector-indexed search, enabling semantic Q&A and cleanup of 2,000+ stale documents.",
      "Generated $50M in production value by engineering a real-time well performance platform with .NET, Angular, and OpenAI models.",
      "Accelerated developer velocity by 10% for 500+ engineers by creating shared Python and Angular component libraries.",
      "Eliminated 2,000+ hours of manual labor with .NET API endpoints on Azure Function Apps for automated logging.",
      "Led GitHub Copilot adoption, accelerating feature delivery by 30% with prompt engineering standards.",
      "Built SQL stored procedures powering dashboards for 1,000+ wells for real-time production insights.",
    ],
  },
  {
    type: "project",
    title: "AI Prompt Generation & MCP Server",
    org: "Personal Project",
    date: "2025",
    bullets: [
      "Containerized codebase analysis platform (Python, FastAPI, Docker, Gemini) generating deterministic prompt artifacts for LLM debugging.",
      "Built an MCP-compliant server using FastMCP exposing schema-validated codebase and git inspection tools to Claude Desktop.",
    ],
  },
  {
    type: "project",
    title: "Bookkeeping Automation App",
    org: "Personal Project",
    date: "2025",
    bullets: [
      "Full-stack app using Azure AI Document Intelligence and GPT-4o mini to parse financial statements, reducing manual effort by 80+ hours per client.",
      "Implemented multi-threading and batching for 1000% speedup and 90% API cost reduction.",
    ],
  },
  {
    type: "patent",
    title: "NASA Patent — US12174259B1",
    org: "Laser-Based Method for Triggering Thermal Runaway of a Battery",
    date: "2024",
    bullets: [
      "Co-inventor on granted patent. Contributed to core technical approach and fine-tuned testing parameters from concept through issuance.",
    ],
  },
  {
    type: "work",
    title: "Software Engineer",
    org: "Chevron",
    date: "2020 — 2023",
    bullets: [
      "Engineered a resilient data ingestion pipeline using AKS and Azure Monitor Edge for real-time executive decision-making.",
      "Automated enterprise vulnerability remediation with Python/C# backend workflows integrated with SaaS security platforms.",
      "Led modernization of enterprise Artifactory, boosting feature delivery by 40% and stability of 4,000+ global pipelines by 25%.",
      "Built petabyte-scale pipelines with Azure Data Factory and SQL, driving $10M in annual IT savings.",
    ],
  },
  {
    type: "education",
    title: "B.S. Computer & Electrical Engineering",
    org: "University of Houston",
    date: "2020",
    bullets: [
      "GPA: 3.94",
      "Certifications: AZ-104, AI-900, AZ-900, AWS Cloud Practitioner",
    ],
  },
];

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
  project: Lightbulb,
  patent: Award,
};

const colorMap = {
  work: "bg-teal-500",
  education: "bg-blue-500",
  project: "bg-violet-500",
  patent: "bg-amber-500",
};

const dotColorMap = {
  work: "text-teal-500",
  education: "text-blue-500",
  project: "text-violet-500",
  patent: "text-amber-500",
};

export default function ExperienceDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg overflow-y-auto bg-white shadow-2xl dark:bg-gray-900 sm:max-w-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Experience & Timeline
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="px-6 py-8">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" />

                {timeline.map((entry, i) => {
                  const Icon = iconMap[entry.type];
                  return (
                    <motion.div
                      key={i}
                      className="relative mb-8 pl-12 last:mb-0"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.1,
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 flex h-9 w-9 items-center justify-center rounded-full ${colorMap[entry.type]} shadow-md`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>

                      {/* Date */}
                      <p className={`text-xs font-semibold uppercase tracking-wide ${dotColorMap[entry.type]}`}>
                        {entry.date}
                      </p>

                      {/* Title & org */}
                      <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.org}
                      </p>

                      {/* Bullets */}
                      <ul className="mt-3 space-y-2">
                        {entry.bullets.map((bullet, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colorMap[entry.type]} opacity-50`} />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
