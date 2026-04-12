"use client";

import { useState } from "react";

/* ── sample content matching the real site ── */
const sampleHeading = "Hey, I'm Safan!";
const sampleTitle = "Software Engineer & NASA Patent Co-Inventor";
const sampleBody =
  "I'm a Full-Stack Software Engineer with a passion for building scalable, impactful solutions. From engineering enterprise platforms that generated $50M in production value to co-inventing a NASA patent, I thrive on tackling complex technical challenges.";
const sampleSkills = [
  "Full-Stack Engineering",
  "AI & LLM Systems",
  "Cloud Architecture",
];

/* ── grain overlay SVG as inline data URI ── */
const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type HeadingStyle = "current" | "a" | "b" | "c";

function SectionHeadingVariant({
  style,
  label,
  active,
  onClick,
}: {
  style: HeadingStyle;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-teal-500 bg-teal-500/10 text-teal-400"
          : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function CurrentHeading() {
  return (
    <h2 className="text-center text-3xl font-bold text-white">Projects</h2>
  );
}

function HeadingOptionA() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-xs font-medium tracking-[0.3em] uppercase"
        style={{ fontFamily: "var(--font-geist-mono), monospace", color: "#0d9488" }}
      >
        03 / Portfolio
      </span>
      <h2
        className="text-4xl font-bold tracking-tight text-white"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Projects
      </h2>
      <div className="mt-1 h-px w-16 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
    </div>
  );
}

function HeadingOptionB() {
  return (
    <div className="flex items-center gap-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
      <div className="flex flex-col items-center">
        <h2
          className="text-4xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          Projects
        </h2>
        <span
          className="mt-1 text-[10px] tracking-[0.5em] uppercase text-teal-400/60"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Selected work
        </span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
    </div>
  );
}

function HeadingOptionC() {
  return (
    <div className="relative">
      <span
        className="absolute -top-6 left-0 text-[10px] font-semibold tracking-[0.4em] uppercase text-teal-500"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        What I&apos;ve built
      </span>
      <h2
        className="text-5xl font-bold tracking-tight text-white"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Projects
        <span className="text-teal-500">.</span>
      </h2>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function PreviewContent() {
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>("a");
  const [showGrain, setShowGrain] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-950 text-white">
      {/* Grain overlay */}
      {showGrain && (
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: grainSvg,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
      )}

      {/* Ambient blobs — same as main site */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-[140px]" />
        <div className="absolute top-[50%] right-[5%] h-80 w-80 rounded-full bg-teal-500 opacity-15 blur-[140px]" />
        <div className="absolute bottom-[15%] left-[35%] h-72 w-72 rounded-full bg-pink-500 opacity-10 blur-[140px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Page header */}
        <div className="mb-16 text-center">
          <span
            className="text-xs tracking-[0.3em] uppercase text-teal-400/70"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Design Preview
          </span>
          <h1
            className="mt-2 text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Proposed Improvements
          </h1>
          <p className="mt-3 text-gray-400" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Compare current vs proposed. Nothing is applied to the live site yet.
          </p>
        </div>

        {/* ─── 1. TYPOGRAPHY ─── */}
        <section className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-bold text-teal-400">
              1
            </span>
            <h2 className="text-xl font-bold">Typography</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current */}
            <GlassCard>
              <span className="mb-4 inline-block rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Current &mdash; Geist Sans
              </span>
              <div style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
                <h3 className="text-3xl font-bold">{sampleHeading}</h3>
                <p className="mt-2 text-base font-semibold text-teal-300">
                  {sampleTitle}
                </p>
                <p className="mt-1 text-xs tracking-wide text-gray-400">
                  {sampleSkills.join("  \u2022  ")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {sampleBody}
                </p>
              </div>
            </GlassCard>

            {/* Proposed */}
            <GlassCard className="border-teal-500/30">
              <span className="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                Proposed &mdash; Bricolage Grotesque + DM Sans
              </span>
              <div>
                <h3
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  {sampleHeading}
                </h3>
                <p
                  className="mt-2 text-base font-semibold text-teal-300"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  {sampleTitle}
                </p>
                <p
                  className="mt-1 text-xs tracking-wide text-gray-400"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  {sampleSkills.join("  \u2022  ")}
                </p>
                <p
                  className="mt-3 text-sm leading-relaxed text-gray-400"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  {sampleBody}
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ─── 2. SECTION HEADINGS ─── */}
        <section className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-bold text-teal-400">
              2
            </span>
            <h2 className="text-xl font-bold">Section Headings</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Variant picker */}
          <div className="mb-8 flex flex-wrap gap-2">
            <SectionHeadingVariant
              style="current"
              label="Current"
              active={headingStyle === "current"}
              onClick={() => setHeadingStyle("current")}
            />
            <SectionHeadingVariant
              style="a"
              label="A: Numbered + accent line"
              active={headingStyle === "a"}
              onClick={() => setHeadingStyle("a")}
            />
            <SectionHeadingVariant
              style="b"
              label="B: Flanked with rule lines"
              active={headingStyle === "b"}
              onClick={() => setHeadingStyle("b")}
            />
            <SectionHeadingVariant
              style="c"
              label="C: Left-aligned with label"
              active={headingStyle === "c"}
              onClick={() => setHeadingStyle("c")}
            />
          </div>

          {/* Preview area */}
          <GlassCard className="flex min-h-[200px] items-center justify-center">
            <div className="w-full max-w-lg">
              {headingStyle === "current" && <CurrentHeading />}
              {headingStyle === "a" && <HeadingOptionA />}
              {headingStyle === "b" && <HeadingOptionB />}
              {headingStyle === "c" && <HeadingOptionC />}
            </div>
          </GlassCard>

          {/* Show all headings applied to the real section names */}
          {headingStyle !== "current" && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {[
                { num: "01", label: "Who I am", title: "About Me" },
                { num: "02", label: "Selected work", title: "Projects" },
                { num: "03", label: "Tech stack", title: "Skills" },
                { num: "04", label: "Say hello", title: "Contact" },
              ].map((section) => (
                <GlassCard key={section.num} className="flex items-center justify-center py-10">
                  {headingStyle === "a" && (
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className="text-xs font-medium tracking-[0.3em] uppercase"
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          color: "#0d9488",
                        }}
                      >
                        {section.num} / {section.label}
                      </span>
                      <h3
                        className="text-3xl font-bold tracking-tight text-white"
                        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                      >
                        {section.title}
                      </h3>
                      <div className="mt-1 h-px w-12 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                    </div>
                  )}
                  {headingStyle === "b" && (
                    <div className="flex w-full items-center gap-4 px-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                      <div className="flex flex-col items-center">
                        <h3
                          className="text-3xl font-bold tracking-tight text-white"
                          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                        >
                          {section.title}
                        </h3>
                        <span
                          className="mt-1 text-[10px] tracking-[0.5em] uppercase text-teal-400/60"
                          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                        >
                          {section.label}
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                  )}
                  {headingStyle === "c" && (
                    <div className="relative w-full px-4">
                      <span
                        className="absolute -top-4 left-4 text-[10px] font-semibold tracking-[0.4em] uppercase text-teal-500"
                        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                      >
                        {section.label}
                      </span>
                      <h3
                        className="text-4xl font-bold tracking-tight text-white"
                        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                      >
                        {section.title}
                        <span className="text-teal-500">.</span>
                      </h3>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* ─── 3. GRAIN TEXTURE ─── */}
        <section className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-bold text-teal-400">
              3
            </span>
            <h2 className="text-xl font-bold">Background Grain Texture</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setShowGrain(!showGrain)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                showGrain ? "bg-teal-500" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  showGrain ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-400">
              {showGrain ? "Grain overlay active — look at the background" : "Grain off — toggle to compare"}
            </span>
          </div>

          <GlassCard>
            <p className="text-sm leading-relaxed text-gray-400">
              A subtle noise texture (3% opacity, mix-blend overlay) layered over the entire page adds
              tactile depth to the gradient blobs. It prevents the &ldquo;flat digital&rdquo; look without
              being distracting. Toggle the switch above and look at the dark background areas — the
              difference is subtle but gives the page a more refined, printed quality.
            </p>
          </GlassCard>
        </section>

        {/* ─── Combined preview ─── */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-sm font-bold text-violet-400">
              *
            </span>
            <h2 className="text-xl font-bold">Combined Preview</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <GlassCard className="border-violet-500/20">
            <p className="mb-8 text-sm text-gray-500">
              All three improvements applied together — how a section of your portfolio would feel.
            </p>

            {/* Simulated section */}
            <div className="rounded-xl bg-gray-950/50 px-8 py-16">
              <div className="mx-auto max-w-2xl">
                {/* Heading (option A style) */}
                <div className="mb-10 flex flex-col items-center gap-2">
                  <span
                    className="text-xs font-medium tracking-[0.3em] uppercase"
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "#0d9488",
                    }}
                  >
                    01 / Who I am
                  </span>
                  <h2
                    className="text-4xl font-bold tracking-tight text-white"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                  >
                    About Me
                  </h2>
                  <div className="mt-1 h-px w-16 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                </div>

                {/* Body text */}
                <p
                  className="text-center text-lg leading-relaxed text-gray-300"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  {sampleBody}
                </p>

                {/* Stat cards */}
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { value: "5+", label: "Years Experience" },
                    { value: "5", label: "Certifications" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                    >
                      <p
                        className="text-3xl font-bold text-teal-400"
                        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="mt-1 text-sm text-gray-400"
                        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Back link */}
        <div className="mt-16 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 transition-colors hover:text-teal-400"
          >
            &larr; Back to live site
          </a>
        </div>
      </div>
    </div>
  );
}
