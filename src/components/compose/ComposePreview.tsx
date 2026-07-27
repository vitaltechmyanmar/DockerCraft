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

  return (
    <div className="flex flex-col h-full gap-3 pt-4 sm:pt-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <span className="status-dot" style={{ width: 5, height: 5, background: "var(--accent)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>docker-compose.yml</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {composeYml.split("\n").length} lines
          </div>
        </div>

        <div className="flex gap-2">
          <CopyButton text={composeYml} />
          <DownloadButton content={composeYml} filename="docker-compose.yml" />
        </div>
      </div>

      {/* Code block — fills remaining height */}
      <div
        className="flex-1 overflow-hidden rounded min-h-[300px] sm:min-h-[400px]"
        style={{ border: "1px solid var(--border)", background: "#0d1117" }}
      >
        <CodeBlock
          code={composeYml}
          language="yaml"
          maxHeight="100%"
        />
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
