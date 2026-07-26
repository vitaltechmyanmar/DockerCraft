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
import {
  Container,
  Layers,
  Github,
  Zap,
  FileText,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

type AppTab = "dockerfile" | "compose";
type MobileView = "config" | "preview";

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("dockerfile");
  const [mobileView, setMobileView] = useState<MobileView>("config");
  const [dockerfileConfig, setDockerfileConfig] = useState<DockerfileConfig>(DEFAULT_DOCKERFILE_CONFIG);
  const [composeConfig, setComposeConfig] = useState<ComposeConfig>(DEFAULT_COMPOSE_CONFIG);

  return (
    <div className="min-h-screen bg-[#070d1a] grid-bg relative overflow-x-hidden">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#0db7ed"
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-docker-blue/40 via-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ─── Header ──────────────────────────────────────────────── */}
        <header className="border-b border-white/[0.06] glass sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-docker-blue/20 border border-docker-blue/30 flex items-center justify-center glow-blue">
                  <Container size={16} className="text-docker-blue" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-docker-blue animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold gradient-text leading-none">DockerCraft</h1>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 hidden xs:block">Dockerfile & Compose Generator</p>
              </div>
            </div>

            {/* Tab Switcher — center on desktop, hidden on mobile (bottom nav used instead) */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl glass border border-white/10">
              <TabButton
                active={activeTab === "dockerfile"}
                onClick={() => setActiveTab("dockerfile")}
                icon={<FileText size={14} />}
                label="Dockerfile"
              />
              <TabButton
                active={activeTab === "compose"}
                onClick={() => setActiveTab("compose")}
                icon={<Layers size={14} />}
                label="Compose"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <Zap size={11} />
                <span>Live Preview</span>
              </div>
              <a
                href="https://github.com/vitaltechmyanmar/DockerCraft"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
                aria-label="View on GitHub"
              >
                <Github size={17} />
              </a>
            </div>
          </div>
        </header>

        {/* ─── Hero Banner ─────────────────────────────────────────── */}
        <div className="text-center py-6 sm:py-8 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-docker-blue/10 border border-docker-blue/20 text-docker-blue text-xs font-medium mb-4">
              <Zap size={11} />
              <span>14+ frameworks supported</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-2 text-balance">
              Generate{" "}
              <span className="gradient-text glow-text">Production-Ready</span>{" "}
              Docker Configs
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Configure your stack, preview instantly, copy or download.
              Best-practice defaults included.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mt-4"
          >
            {[
              { label: "Frameworks", value: "14+" },
              { label: "Templates", value: "8" },
              { label: "Multi-Stage", value: "✓" },
              { label: "Open Source", value: "✓" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-base sm:text-lg font-bold text-docker-blue">{stat.value}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── Mobile Tab Switcher ──────────────────────────────────── */}
        <div className="sm:hidden px-4 mb-3">
          <div className="flex items-center gap-1 p-1 rounded-xl glass border border-white/10 w-full">
            <MobileTabButton
              active={activeTab === "dockerfile"}
              onClick={() => setActiveTab("dockerfile")}
              icon={<FileText size={14} />}
              label="Dockerfile"
            />
            <MobileTabButton
              active={activeTab === "compose"}
              onClick={() => setActiveTab("compose")}
              icon={<Layers size={14} />}
              label="Compose"
            />
          </div>
        </div>

        {/* ─── Mobile View Toggle ───────────────────────────────────── */}
        <div className="lg:hidden px-4 mb-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10">
            <MobileViewButton
              active={mobileView === "config"}
              onClick={() => setMobileView("config")}
              icon={<Settings size={13} />}
              label="Configure"
            />
            <MobileViewButton
              active={mobileView === "preview"}
              onClick={() => setMobileView("preview")}
              icon={<Eye size={13} />}
              label="Preview"
            />
          </div>
        </div>

        {/* ─── Main Content ─────────────────────────────────────────── */}
        <div className="flex-1 px-3 sm:px-4 lg:px-6 pb-6 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === "dockerfile" ? (
              <motion.div
                key="dockerfile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
              >
                {/* Left Panel — Config */}
                <div
                  className={cn(
                    "glass rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300",
                    mobileView === "preview" ? "hidden lg:block" : "block"
                  )}
                >
                  <PanelHeader
                    icon={<Settings size={13} />}
                    title="Configuration"
                    subtitle="Set up your Dockerfile options"
                  />
                  <div className="p-4 sm:p-5">
                    <DockerfileForm config={dockerfileConfig} onChange={setDockerfileConfig} />
                  </div>
                </div>

                {/* Right Panel — Preview */}
                <div
                  className={cn(
                    "glass rounded-2xl border border-white/[0.08] flex flex-col overflow-hidden transition-all duration-300",
                    mobileView === "config" ? "hidden lg:flex" : "flex",
                    "min-h-[500px] sm:min-h-[600px]"
                  )}
                >
                  <PanelHeader
                    icon={<FileText size={13} />}
                    title="Generated Output"
                    subtitle="Real-time preview"
                    badge={<LiveBadge />}
                  />
                  <div className="flex-1 overflow-hidden p-4 sm:p-5 pt-0">
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
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
              >
                {/* Left Panel */}
                <div
                  className={cn(
                    "glass rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300",
                    mobileView === "preview" ? "hidden lg:block" : "block"
                  )}
                >
                  <PanelHeader
                    icon={<Layers size={13} />}
                    title="Services"
                    subtitle="Configure your multi-service stack"
                  />
                  <div className="p-4 sm:p-5">
                    <ComposeForm config={composeConfig} onChange={setComposeConfig} />
                  </div>
                </div>

                {/* Right Panel */}
                <div
                  className={cn(
                    "glass rounded-2xl border border-white/[0.08] flex flex-col overflow-hidden transition-all duration-300",
                    mobileView === "config" ? "hidden lg:flex" : "flex",
                    "min-h-[500px] sm:min-h-[600px]"
                  )}
                >
                  <PanelHeader
                    icon={<FileText size={13} />}
                    title="Generated Output"
                    subtitle="Real-time preview"
                    badge={<LiveBadge />}
                  />
                  <div className="flex-1 overflow-hidden p-4 sm:p-5 pt-0">
                    <ComposePreview config={composeConfig} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.06] py-4 sm:py-5 px-4 sm:px-6">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-600">
              Built with{" "}
              <span className="text-docker-blue">Next.js</span> ·{" "}
              <span className="text-docker-blue">Aceternity UI</span> ·{" "}
              <span className="text-docker-blue">Tailwind CSS</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">v1.0.0</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-xs text-slate-600">MIT License</span>
            </div>
          </div>
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
        "relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active ? "text-white" : "text-slate-500 hover:text-slate-300"
      )}
    >
      {active && (
        <motion.div
          layoutId="active-tab-bg"
          className="absolute inset-0 rounded-lg bg-docker-blue/20 border border-docker-blue/40"
          transition={{ type: "spring", duration: 0.4 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
}

function MobileTabButton({
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
        "relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        active ? "text-white" : "text-slate-500"
      )}
    >
      {active && (
        <motion.div
          layoutId="mobile-active-tab-bg"
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

function MobileViewButton({
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
        "relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all duration-200",
        active
          ? "bg-white/10 text-slate-200 border border-white/20"
          : "text-slate-500 hover:text-slate-400"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function PanelHeader({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/[0.06]">
      <div className="w-7 h-7 rounded-lg bg-docker-blue/10 border border-docker-blue/20 flex items-center justify-center text-docker-blue flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
    </div>
  );
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      Live
    </div>
  );
}
