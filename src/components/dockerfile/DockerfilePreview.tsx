"use client";
import { useState } from "react";
import { DockerfileConfig } from "@/types/dockerfile";
import { generateDockerfile, generateDockerignore } from "@/lib/generators/dockerfile";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { cn } from "@/lib/utils";
import { FileText, Shield } from "lucide-react";

interface DockerfilePreviewProps {
  config: DockerfileConfig;
}

type TabType = "dockerfile" | "dockerignore";

export function DockerfilePreview({ config }: DockerfilePreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dockerfile");

  const dockerfile = generateDockerfile(config);
  const dockerignore = generateDockerignore(config);
  const activeContent = activeTab === "dockerfile" ? dockerfile : dockerignore;
  const activeFilename = activeTab === "dockerfile" ? "Dockerfile" : ".dockerignore";
  const activeLanguage = activeTab === "dockerfile" ? "dockerfile" : "bash";

  return (
    <div className="flex flex-col h-full gap-3 pt-4 sm:pt-5">

      {/* Tabs + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          className="flex items-center gap-1 p-1 rounded"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <PreviewTabBtn active={activeTab === "dockerfile"} onClick={() => setActiveTab("dockerfile")} icon={<FileText size={11} />} label="Dockerfile" />
          <PreviewTabBtn active={activeTab === "dockerignore"} onClick={() => setActiveTab("dockerignore")} icon={<Shield size={11} />} label=".dockerignore" />
        </div>
        <div className="flex gap-2">
          <CopyButton text={activeContent} />
          <DownloadButton content={activeContent} filename={activeFilename} />
        </div>
      </div>

      {/* File pill */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <span className="status-dot" style={{ width: 5, height: 5 }} />
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{activeFilename}</span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{activeContent.split("\n").length} lines</span>
      </div>

      {/* Code block */}
      <div
        className="flex-1 overflow-hidden rounded min-h-[300px] sm:min-h-[400px]"
        style={{ border: "1px solid var(--border)", background: "#0d1117" }}
      >
        <CodeBlock code={activeContent} language={activeLanguage} maxHeight="100%" />
      </div>
    </div>
  );
}

function PreviewTabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors duration-150",
        active ? "tab-active" : "tab-inactive"
      )}
    >
      {icon}{label}
    </button>
  );
}
