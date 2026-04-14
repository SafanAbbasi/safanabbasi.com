"use client";

import { motion } from "motion/react";
import { SiOpenai, SiRust } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import PythonOriginal from "devicons-react/lib/icons/PythonOriginal";
import DockerOriginal from "devicons-react/lib/icons/DockerOriginal";
import AzureOriginal from "devicons-react/lib/icons/AzureOriginal";
import ReactOriginal from "devicons-react/lib/icons/ReactOriginal";
import TypescriptOriginal from "devicons-react/lib/icons/TypescriptOriginal";
import KubernetesOriginal from "devicons-react/lib/icons/KubernetesOriginal";
import DotNetOriginal from "devicons-react/lib/icons/DotNetOriginal";
import PostgresqlOriginal from "devicons-react/lib/icons/PostgresqlOriginal";
import GitOriginal from "devicons-react/lib/icons/GitOriginal";
import TerraformOriginal from "devicons-react/lib/icons/TerraformOriginal";
import AngularOriginal from "devicons-react/lib/icons/AngularOriginal";
import GooglecloudOriginal from "devicons-react/lib/icons/GooglecloudOriginal";

type IconEntry = {
  Icon: React.FC<{ className?: string; size?: number }>;
  label: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
  color?: string;
};

const icons: IconEntry[] = [
  // Left side
  {
    Icon: PythonOriginal,
    label: "Python",
    x: "5%",
    y: "15%",
    duration: 5,
    delay: 0,
  },
  {
    Icon: DockerOriginal,
    label: "Docker",
    x: "3%",
    y: "35%",
    duration: 6,
    delay: 0.5,
  },
  {
    Icon: AzureOriginal,
    label: "Azure",
    x: "8%",
    y: "55%",
    duration: 5.5,
    delay: 1,
  },
  {
    Icon: KubernetesOriginal,
    label: "Kubernetes",
    x: "4%",
    y: "75%",
    duration: 7,
    delay: 0.6,
  },
  {
    Icon: DotNetOriginal,
    label: ".NET",
    x: "12%",
    y: "25%",
    duration: 6.5,
    delay: 0.3,
  },
  {
    Icon: TerraformOriginal,
    label: "Terraform",
    x: "11%",
    y: "65%",
    duration: 5.5,
    delay: 1.1,
  },
  // Right side
  {
    Icon: ReactOriginal,
    label: "React",
    x: "88%",
    y: "15%",
    duration: 6.5,
    delay: 0.3,
  },
  {
    Icon: TypescriptOriginal,
    label: "TypeScript",
    x: "85%",
    y: "35%",
    duration: 5,
    delay: 0.8,
  },
  {
    Icon: FaAws,
    label: "AWS",
    x: "90%",
    y: "55%",
    duration: 6,
    delay: 1.2,
    color: "#FF9900",
  },
  {
    Icon: AngularOriginal,
    label: "Angular",
    x: "87%",
    y: "75%",
    duration: 5.5,
    delay: 0.4,
  },
  {
    Icon: PostgresqlOriginal,
    label: "PostgreSQL",
    x: "92%",
    y: "25%",
    duration: 7,
    delay: 0.7,
  },
  {
    Icon: GitOriginal,
    label: "Git",
    x: "84%",
    y: "65%",
    duration: 6,
    delay: 0.9,
  },
  {
    Icon: SiRust,
    label: "Rust",
    x: "10%",
    y: "45%",
    duration: 5,
    delay: 1.3,
    color: "#CE422B",
  },
  {
    Icon: GooglecloudOriginal,
    label: "GCP",
    x: "6%",
    y: "85%",
    duration: 6,
    delay: 0.2,
  },
  {
    Icon: SiOpenai,
    label: "OpenAI",
    x: "90%",
    y: "85%",
    duration: 5.5,
    delay: 1.0,
    color: "#10A37F",
  },
] as const;

export default function FloatingTechIcons({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <>
      {icons.map(({ Icon, label, x, y, duration, delay, color }, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: x, top: y, ...(color ? { color } : {}) }}
          animate={
            reduceMotion
              ? { y: 0, opacity: 0.7 }
              : { y: [0, -12, 0], opacity: [0.6, 0.85, 0.6] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration, delay, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Icon className="h-10 w-10" size={40} />
          <span className="text-[10px] font-medium">{label}</span>
        </motion.div>
      ))}
    </>
  );
}
