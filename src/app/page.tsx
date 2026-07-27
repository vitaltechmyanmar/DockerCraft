"use client";

import { useState } from "react";
import { DockerfileForm } from "@/components/dockerfile/DockerfileForm";
import { DockerfilePreview } from "@/components/dockerfile/DockerfilePreview";
import { ComposeForm } from "@/components/compose/ComposeForm";
import { ComposePreview } from "@/components/compose/ComposePreview";
import { DockerfileConfig } from "@/types/dockerfile";
import { ComposeConfig } from "@/types/compose";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import { Container, Layers, Github, FileText, Settings, Eye } from "lucide-react";

// ─── Default Configs ──────────────────────────────────────────────

const DEFAULT_DOCKERFILE_CONFIG: DockerfileConfig = {
  framework: "nodejs",
  version: "20",
  baseImage: "alpine",
  workdir: "/app",
  port: 3000,
  envVars: [],
  buildCommand: "npm ci --omit=dev",
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-panel)" }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
            >
              <Container size={14} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>DockerCraft</span>
              <span className="hidden sm:inline ml-2 text-xs" style={{ color: "var(--text-subtle)" }}>Dockerfile & Compose Generator</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div
            className="hidden sm:flex items-center gap-1 p-1 rounded-md"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <TabButton active={activeTab === "dockerfile"} onClick={() => setActiveTab("dockerfile")} icon={<FileText size={13} />} label="Dockerfile" />
            <TabButton active={activeTab === "compose"} onClick={() => setActiveTab("compose")} icon={<Layers size={13} />} label="Compose" />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span
              className="hidden md:flex items-center gap-1.5 text-xs px-2 py-1 rounded"
              style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(63,185,80,0.2)" }}
            >
              <span className="status-dot" />
              Live
            </span>
            <a
              href="https://github.com/vitaltechmyanmar/DockerCraft"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "var(--text-subtle)" }}
              aria-label="View on GitHub"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </header>

      {/* ─── Sub-header: breadcrumb + stats ─────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--border-muted)", background: "var(--bg-panel)" }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span>Generate production-ready Docker configurations</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            {[
              { v: "15", l: "Frameworks" },
              { v: "8", l: "Presets" },
              { v: "v1.1", l: "Version" },
            ].map(({ v, l }) => (
              <span key={l}>
                <span className="font-semibold" style={{ color: "var(--accent)" }}>{v}</span>
                {" "}{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile tab switcher ─────────────────────────────────── */}
      <div className="sm:hidden px-3 pt-3">
        <div
          className="flex items-center gap-1 p-1 rounded-md w-full"
          style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}
        >
          <MobileTabButton active={activeTab === "dockerfile"} onClick={() => setActiveTab("dockerfile")} icon={<FileText size={13} />} label="Dockerfile" />
          <MobileTabButton active={activeTab === "compose"} onClick={() => setActiveTab("compose")} icon={<Layers size={13} />} label="Compose" />
        </div>
      </div>

      {/* ─── Mobile view toggle ──────────────────────────────────── */}
      <div className="lg:hidden px-3 pt-2">
        <div
          className="flex items-center gap-1 p-1 rounded-md"
          style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}
        >
          <MobileViewButton active={mobileView === "config"} onClick={() => setMobileView("config")} icon={<Settings size={12} />} label="Configure" />
          <MobileViewButton active={mobileView === "preview"} onClick={() => setMobileView("preview")} icon={<Eye size={12} />} label="Preview" />
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-3 sm:px-4 lg:px-6 py-4">
        {activeTab === "dockerfile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
            {/* Config Panel */}
            <div
              className={cn("panel overflow-hidden", mobileView === "preview" ? "hidden lg:block" : "block")}
            >
              <PanelHeader icon={<Settings size={12} />} title="Configuration" subtitle="Dockerfile options" />
              <div className="p-4 sm:p-5">
                <DockerfileForm config={dockerfileConfig} onChange={setDockerfileConfig} />
              </div>
            </div>

            {/* Preview Panel */}
            <div
              className={cn(
                "panel flex flex-col overflow-hidden min-h-[500px] sm:min-h-[600px]",
                mobileView === "config" ? "hidden lg:flex" : "flex"
              )}
            >
              <PanelHeader icon={<FileText size={12} />} title="Generated Output" subtitle="Real-time preview" live />
              <div className="flex-1 overflow-hidden p-4 sm:p-5 pt-0">
                <DockerfilePreview config={dockerfileConfig} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
            {/* Config Panel */}
            <div
              className={cn("panel overflow-hidden", mobileView === "preview" ? "hidden lg:block" : "block")}
            >
              <PanelHeader icon={<Layers size={12} />} title="Services" subtitle="Multi-service stack" />
              <div className="p-4 sm:p-5">
                <ComposeForm config={composeConfig} onChange={setComposeConfig} />
              </div>
            </div>

            {/* Preview Panel */}
            <div
              className={cn(
                "panel flex flex-col overflow-hidden min-h-[500px] sm:min-h-[600px]",
                mobileView === "config" ? "hidden lg:flex" : "flex"
              )}
            >
              <PanelHeader icon={<FileText size={12} />} title="Generated Output" subtitle="Real-time preview" live />
              <div className="flex-1 overflow-hidden p-4 sm:p-5 pt-0">
                <ComposePreview config={composeConfig} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-panel)" }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Built with{" "}
            <span style={{ color: "var(--accent)" }}>Next.js</span> ·{" "}
            <span style={{ color: "var(--accent)" }}>Tailwind CSS</span>
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span>v1.1.0</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150",
        active ? "tab-active" : "tab-inactive"
      )}
    >
      {icon}{label}
    </button>
  );
}

function MobileTabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-all duration-150",
        active ? "tab-active" : "tab-inactive"
      )}
    >
      {icon}{label}
    </button>
  );
}

function MobileViewButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-all duration-150",
        active ? "tab-active" : "tab-inactive"
      )}
    >
      {icon}{label}
    </button>
  );
}

function PanelHeader({ icon, title, subtitle, live }: { icon: React.ReactNode; title: string; subtitle: string; live?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</p>
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{subtitle}</p>
      </div>
      {live && (
        <div
          className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded"
          style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(63,185,80,0.2)" }}
        >
          <span className="status-dot" style={{ width: 5, height: 5 }} />
          Live
        </div>
      )}
    </div>
  );
}
