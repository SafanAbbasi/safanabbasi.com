"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ExperienceDrawer from "./ExperienceDrawer";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "5", label: "Certifications" },
];

const milestones = [
  { year: "2020", label: "B.S. Engineering", color: "bg-blue-500" },
  { year: "2020", label: "Chevron SWE", color: "bg-teal-500" },
  { year: "2023", label: "Full-Stack SWE", color: "bg-teal-600" },
  { year: "2024", label: "NASA Patent", color: "bg-amber-500" },
  { year: "2025", label: "AI & MCP", color: "bg-violet-500" },
];

export default function AboutSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>

        <motion.p
          className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          I&apos;m a Full-Stack Software Engineer with a passion for building
          scalable, impactful solutions. From engineering enterprise platforms
          that generated $50M in production value to co-inventing a NASA patent,
          I thrive on tackling complex technical challenges. My work spans AI &
          LLM systems, cloud architecture, and full-stack development — always
          with a focus on delivering real results.
        </motion.p>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-gray-200/40 bg-white/40 p-5 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Horizontal timeline graphic */}
        <motion.div
          className="mt-12 cursor-pointer rounded-2xl border border-gray-200/40 bg-white/40 p-6 backdrop-blur-sm transition-colors hover:border-teal-500/30 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-400/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          onClick={() => setDrawerOpen(true)}
        >
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Click to explore my journey
          </p>
          <div className="relative flex items-center justify-between px-2">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-3 bg-gradient-to-r from-blue-500 via-teal-500 to-violet-500 opacity-30" />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="relative z-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              >
                <div
                  className={`h-3.5 w-3.5 rounded-full ${m.color} shadow-md ring-2 ring-white dark:ring-gray-900`}
                />
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {m.year}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {m.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <ExperienceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}
