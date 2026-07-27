"use client";
import { useState } from "react";
import { ComposeConfig } from "@/types/compose";
import { generateCompose, generateComposeDockerignore } from "@/lib/generators/compose";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { cn } from "@/lib/utils";
import { Layers, Shield } from "lucide-react";

interface ComposePreviewProps {
  config: ComposeConfig;
}

type TabType = "compose" | "dockerignore";

export function ComposePreview({ config }: ComposePreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("compose");

  const composeYml = generateCompose(config);
  const dockerignore = generateComposeDockerignore();

  const activeContent = activeTab === "compose" ? composeYml : dockerignore;
  const activeFilename = activeTab === "compose" ? "docker-compose.yml" : ".dockerignore";
  const activeLanguage = activeTab === "compose" ? "yaml" : "bash";

  return (
    <div className="flex flex-col h-full gap-3 pt-4 sm:pt-5">
      {/* Top row — tabs + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          <button
            id="compose-tab-compose"
            onClick={() => setActiveTab("compose")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "compose"
                ? "bg-docker-blue/20 text-docker-blue"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Layers size={11} />
            docker-compose.yml
          </button>
          <button
            id="compose-tab-dockerignore"
            onClick={() => setActiveTab("dockerignore")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              activeTab === "dockerignore"
                ? "bg-docker-blue/20 text-docker-blue"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Shield size={11} />
            .dockerignore
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <CopyButton text={activeContent} />
          <DownloadButton content={activeContent} filename={activeFilename} />
        </div>
      </div>

      {/* File badge + line count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/[0.08]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">{activeFilename}</span>
        </div>
        <div className="text-xs text-slate-600">
          {activeContent.split("\n").length} lines
        </div>
      </div>

      {/* Code block — fills remaining height */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111827] min-h-[300px] sm:min-h-[400px]">
        <CodeBlock
          code={activeContent}
          language={activeLanguage}
          maxHeight="100%"
        />
      </div>
    </div>
  );
}
