"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function ScrollNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);

      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          setActive(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200/30 bg-white/70 px-2 py-1.5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-gray-900/70"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                active === s.id
                  ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {s.label}
            </a>
          ))}
          <div className="mx-1 h-4 w-px bg-gray-200 dark:bg-white/20" />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-yellow-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
