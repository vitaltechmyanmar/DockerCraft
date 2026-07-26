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
    <div className="flex flex-col h-full gap-3">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.05] border border-white/10">
          <button
            onClick={() => setActiveTab("dockerfile")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "dockerfile"
                ? "bg-docker-blue/20 text-docker-blue"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <FileText size={12} />
            Dockerfile
          </button>
          <button
            onClick={() => setActiveTab("dockerignore")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "dockerignore"
                ? "bg-docker-blue/20 text-docker-blue"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Shield size={12} />
            .dockerignore
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <CopyButton text={activeContent} />
          <DownloadButton content={activeContent} filename={activeFilename} />
        </div>
      </div>

      {/* File name badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-docker-blue animate-pulse" />
          <span className="text-xs font-mono text-slate-400">{activeFilename}</span>
        </div>
        <div className="text-xs text-slate-600">
          {activeContent.split("\n").length} lines
        </div>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1e1e1e]">
        <CodeBlock
          code={activeContent}
          language={activeLanguage}
          maxHeight="100%"
        />
      </div>
    </div>
  );
}
