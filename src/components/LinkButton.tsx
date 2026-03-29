"use client";

import { Code, Briefcase, Globe, FileText } from "lucide-react";
import type { LinkItem } from "@/data/links";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Briefcase,
  Globe,
  FileText,
};

export default function LinkButton({ link }: { link: LinkItem }) {
  const Icon = link.icon ? iconMap[link.icon] : null;
  const isExternal = link.url.startsWith("http");

  const handleClick = () => {
    // Fire and forget — don't await, tracking should never block navigation
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId: link.id }),
    }).catch(() => {});
  };

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl py-3.5 px-6 font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
      style={{ backgroundColor: link.bgColor }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = link.hoverColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = link.bgColor)
      }
    >
      {Icon && <Icon className="h-5 w-5" />}
      {link.label}
    </a>
  );
}
