"use client";
import { Download } from "lucide-react";
import { downloadFile } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  content: string;
  filename: string;
  className?: string;
}

export function DownloadButton({ content, filename, className }: DownloadButtonProps) {
  const handleDownload = () => {
    downloadFile(content, filename);
  };

  return (
    <button
      onClick={handleDownload}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        "bg-docker-blue/10 text-docker-blue border border-docker-blue/30 hover:bg-docker-blue/20",
        className
      )}
    >
      <Download size={14} />
      Download
    </button>
  );
}
