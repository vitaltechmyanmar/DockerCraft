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
        </div>
      </div>

      {/* Code block — fills remaining height */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111827] min-h-[300px] sm:min-h-[400px]">
        <CodeBlock
          code={composeYml}
          language="yaml"
          maxHeight="100%"
        />
      </div>
    </div>
  );
}
