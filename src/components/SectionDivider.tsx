"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineScale = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 0.5]);

  return (
    <div ref={ref} className="mx-auto flex max-w-xs items-center gap-4 py-2">
      <motion.div
        className="h-px flex-1 origin-right bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"
        style={{ scaleX: lineScale }}
      />
      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-teal-500"
        style={{ scale: dotScale, opacity: dotOpacity }}
      />
      <motion.div
        className="h-px flex-1 origin-left bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"
        style={{ scaleX: lineScale }}
      />
    </div>
  );
}
