"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { DockerfileForm } from "@/components/dockerfile/DockerfileForm";
import { DockerfilePreview } from "@/components/dockerfile/DockerfilePreview";
import { ComposeForm } from "@/components/compose/ComposeForm";
import { ComposePreview } from "@/components/compose/ComposePreview";
import { DockerfileConfig } from "@/types/dockerfile";
import { ComposeConfig } from "@/types/compose";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import { Container, Layers, Github, Zap, FileText, Settings } from "lucide-react";

// ─── Default Configs ──────────────────────────────────────────────

const DEFAULT_DOCKERFILE_CONFIG: DockerfileConfig = {
  framework: "nodejs",
  version: "20",
  baseImage: "alpine",
  workdir: "/app",
  port: 3000,
  envVars: [],
  buildCommand: "npm ci --only=production",
  startCommand: "node server.js",
  multiStage: true,
  nonRootUser: true,
  healthCheck: false,
  healthCheckPath: "/health",
  healthCheckInterval: 30,
};

const DEFAULT_COMPOSE_CONFIG: ComposeConfig = {
  version: "3.9",
  projectName: "my-project",
  services: [
    {
      id: generateId(),
      name: "app",
      preset: "custom",
      image: "",
      useDockerfile: true,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 3000, container: 3000 }],
      environment: [
        { key: "NODE_ENV", value: "production" },
        { key: "DATABASE_URL", value: "postgresql://postgres:password@db:5432/mydb" },
      ],
      volumes: [],
      dependsOn: ["db"],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-app",
      command: "",
    },
    {
      id: generateId(),
      name: "db",
      preset: "postgres",
      image: "postgres:16-alpine",
      useDockerfile: false,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 5432, container: 5432 }],
      environment: [
        { key: "POSTGRES_USER", value: "postgres" },
        { key: "POSTGRES_PASSWORD", value: "password" },
        { key: "POSTGRES_DB", value: "mydb" },
      ],
      volumes: [{ source: "postgres_data", target: "/var/lib/postgresql/data" }],
      dependsOn: [],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-db",
      command: "",
    },
  ],
  networks: ["app-network"],
  volumes: ["postgres_data"],
};

// ─── Tab Type ─────────────────────────────────────────────────────

type AppTab = "dockerfile" | "compose";

// ─── Main Page ───────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("dockerfile");
  const [dockerfileConfig, setDockerfileConfig] = useState<DockerfileConfig>(DEFAULT_DOCKERFILE_CONFIG);
  const [composeConfig, setComposeConfig] = useState<ComposeConfig>(DEFAULT_COMPOSE_CONFIG);

  return (
    <div className="min-h-screen bg-[#070d1a] grid-bg relative overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#0db7ed"
      />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-docker-blue/40 via-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ─── Header ──────────────────────────────────────────────── */}
        <header className="border-b border-white/[0.06] glass">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-docker-blue/20 border border-docker-blue/30 flex items-center justify-center glow-blue">
                  <Container size={18} className="text-docker-blue" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-docker-blue animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">DockerCraft</h1>
                <p className="text-[10px] text-slate-500 -mt-0.5">Dockerfile & Compose Generator</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass border border-white/10">
              <TabButton
                active={activeTab === "dockerfile"}
                onClick={() => setActiveTab("dockerfile")}
                icon={<FileText size={15} />}
                label="Dockerfile"
              />
              <TabButton
                active={activeTab === "compose"}
                onClick={() => setActiveTab("compose")}
                icon={<Layers size={15} />}
                label="Compose"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <Zap size={12} />
                Live Preview
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </header>

        {/* ─── Hero Banner ─────────────────────────────────────────── */}
        <div className="text-center py-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
              Generate{" "}
              <span className="gradient-text glow-text">Production-Ready</span>
              <br className="sm:hidden" /> Docker Configs
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Configure your stack, preview instantly, copy or download.
              Supports 14+ frameworks with best-practice defaults.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-4"
          >
            {[
              { label: "Frameworks", value: "14+" },
              { label: "Templates", value: "8" },
              { label: "Multi-Stage", value: "✓" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-bold text-docker-blue">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── Main Content ─────────────────────────────────────────── */}
        <div className="flex-1 px-4 sm:px-6 pb-8 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === "dockerfile" ? (
              <motion.div
                key="dockerfile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full"
              >
                {/* Left Panel */}
                <div className="glass rounded-2xl p-5 border border-white/[0.08]">
                  <PanelHeader
                    icon={<Settings size={14} />}
                    title="Configuration"
                    subtitle="Set up your Dockerfile options"
                  />
                  <DockerfileForm config={dockerfileConfig} onChange={setDockerfileConfig} />
                </div>

                {/* Right Panel */}
                <div className="glass rounded-2xl p-5 border border-white/[0.08] flex flex-col min-h-[600px]">
                  <PanelHeader
                    icon={<FileText size={14} />}
                    title="Generated Output"
                    subtitle="Real-time preview"
                  />
                  <div className="flex-1 overflow-hidden">
                    <DockerfilePreview config={dockerfileConfig} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="compose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full"
              >
                {/* Left Panel */}
                <div className="glass rounded-2xl p-5 border border-white/[0.08]">
                  <PanelHeader
                    icon={<Layers size={14} />}
                    title="Services"
                    subtitle="Configure your multi-service stack"
                  />
                  <ComposeForm config={composeConfig} onChange={setComposeConfig} />
                </div>

                {/* Right Panel */}
                <div className="glass rounded-2xl p-5 border border-white/[0.08] flex flex-col min-h-[600px]">
                  <PanelHeader
                    icon={<FileText size={14} />}
                    title="Generated Output"
                    subtitle="Real-time preview"
                  />
                  <div className="flex-1 overflow-hidden">
                    <ComposePreview config={composeConfig} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.06] py-4 px-6 text-center">
          <p className="text-xs text-slate-600">
            Built with{" "}
            <span className="text-docker-blue">Next.js</span> ·{" "}
            <span className="text-docker-blue">Aceternity UI</span> ·{" "}
            <span className="text-docker-blue">Tailwind CSS</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "text-white"
          : "text-slate-500 hover:text-slate-300"
      )}
    >
      {active && (
        <motion.div
          layoutId="active-tab-bg"
          className="absolute inset-0 rounded-lg bg-docker-blue/20 border border-docker-blue/40"
          transition={{ type: "spring", duration: 0.4 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}

function PanelHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
      <div className="w-7 h-7 rounded-lg bg-docker-blue/10 border border-docker-blue/20 flex items-center justify-center text-docker-blue">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
