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
        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95",
        "bg-docker-blue/10 text-docker-blue border border-docker-blue/30 hover:bg-docker-blue/20 hover:border-docker-blue/50",
        className
      )}
    >
      <Download size={13} />
      <span>Download</span>
    </button>
  );
}
