"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";


function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const confettiPieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 50),
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.5 + 0.5,
    color: ["#14b8a6", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"][i % 5],
    delay: Math.random() * 0.3,
  }));

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm dark:bg-gray-900/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={(def: { opacity?: number }) => {
        if (def.opacity === 0) onDone();
      }}
    >
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute h-2 w-2 rounded-full"
          style={{ backgroundColor: piece.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: piece.x,
            y: piece.y,
            opacity: [1, 1, 0],
            scale: piece.scale,
            rotate: piece.rotate,
          }}
          transition={{ duration: 1.2, delay: piece.delay, ease: "easeOut" }}
        />
      ))}

      {/* Animated checkmark */}
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
      >
        <motion.svg
          className="h-8 w-8 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      <motion.p
        className="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Message Sent!
      </motion.p>
      <motion.p
        className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        I&apos;ll get back to you soon.
      </motion.p>
    </motion.div>
  );
}


export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const loadTime = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          website: formState.website,
          _t: loadTime.current,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setFormState({ name: "", email: "", message: "", website: "" });
        setTimeout(() => setStatus("idle"), 3500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <motion.h2
          className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>

        <motion.p
          className="mb-10 text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Have a question or want to work together? Drop me a message!
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="relative mb-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence>
            {status === "sent" && (
              <SuccessOverlay
                onDone={() => setStatus("idle")}
              />
            )}
          </AnimatePresence>
          {/* Honeypot field — hidden from humans, bots fill it in */}
          <input
            type="text"
            name="website"
            value={formState.website}
            onChange={(e) =>
              setFormState({ ...formState, website: e.target.value })
            }
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-0 top-0 h-0 w-0 opacity-0"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              required
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              className="rounded-xl border border-gray-200/60 bg-white/60 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              className="rounded-xl border border-gray-200/60 bg-white/60 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
            />
          </div>
          <textarea
            placeholder="Your message..."
            required
            rows={4}
            value={formState.message}
            onChange={(e) =>
              setFormState({ ...formState, message: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200/60 bg-white/60 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-colors hover:bg-teal-500 disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </motion.form>

        {/* Copyright */}
        <p className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Safan Abbasi
        </p>
      </div>
    </section>
  );
}
