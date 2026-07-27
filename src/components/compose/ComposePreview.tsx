"use client";
import { ComposeConfig } from "@/types/compose";
import { generateCompose } from "@/lib/generators/compose";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";

interface ComposePreviewProps {
  config: ComposeConfig;
}

export function ComposePreview({ config }: ComposePreviewProps) {
  const composeYml = generateCompose(config);
<<<<<<< HEAD
  const dockerignore = generateComposeDockerignore();
  const activeContent = activeTab === "compose" ? composeYml : dockerignore;
  const activeFilename = activeTab === "compose" ? "docker-compose.yml" : ".dockerignore";
  const activeLanguage = activeTab === "compose" ? "yaml" : "bash";

  return (
    <div className="flex flex-col h-full gap-3 pt-4 sm:pt-5">

      {/* Tabs + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          className="flex items-center gap-1 p-1 rounded"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <PreviewTabBtn active={activeTab === "compose"} onClick={() => setActiveTab("compose")} icon={<Layers size={11} />} label="docker-compose.yml" />
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
=======

  return (
    <div className="flex flex-col h-full gap-3 pt-4 sm:pt-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/[0.08]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">docker-compose.yml</span>
          </div>
          <div className="text-xs text-slate-600">
            {composeYml.split("\n").length} lines
          </div>
        </div>

        <div className="flex gap-2">
          <CopyButton text={composeYml} />
          <DownloadButton content={composeYml} filename="docker-compose.yml" />
>>>>>>> parent of 3e25b2f (Feat: Deno framework support)
        </div>
        <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{activeContent.split("\n").length} lines</span>
      </div>

<<<<<<< HEAD
      {/* Code block */}
      <div
        className="flex-1 overflow-hidden rounded min-h-[300px] sm:min-h-[400px]"
        style={{ border: "1px solid var(--border)", background: "#0d1117" }}
      >
        <CodeBlock code={activeContent} language={activeLanguage} maxHeight="100%" />
=======
      {/* Code block — fills remaining height */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111827] min-h-[300px] sm:min-h-[400px]">
        <CodeBlock
          code={composeYml}
          language="yaml"
          maxHeight="100%"
        />
>>>>>>> parent of 3e25b2f (Feat: Deno framework support)
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
