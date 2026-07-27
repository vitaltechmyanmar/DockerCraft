"use client";

import { useState, useCallback } from "react";
import { Button, Tooltip, CircularProgress } from "@mui/material";
import { Archive } from "@mui/icons-material";
import { HelmChartFile } from "@/lib/generators/helm";
import { ComposeConfig } from "@/types/compose";

const DOCKER_BLUE = "#0db7ed";
const BORDER = "#2a3344";
const TEXT_SECONDARY = "#7d8fa3";

interface HelmExportButtonProps {
  config: ComposeConfig;
  helmFiles: HelmChartFile[];
}

export function HelmExportButton({ config, helmFiles }: HelmExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      // Dynamic import so JSZip is only bundled when this button is used
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const folder = zip.folder(config.projectName) ?? zip;

      for (const file of helmFiles) {
        // Support nested paths like "templates/deployment.yaml"
        const parts = file.path.split("/");
        if (parts.length > 1) {
          const dir = parts.slice(0, -1).join("/");
          const subFolder = folder.folder(dir) ?? folder;
          subFolder.file(parts[parts.length - 1], file.content);
        } else {
          folder.file(file.path, file.content);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.projectName}-helm-chart.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Helm export failed:", err);
    } finally {
      setLoading(false);
    }
  }, [config, helmFiles]);

  return (
    <Tooltip title="Download as Helm Chart ZIP">
      <Button
        size="small"
        variant="outlined"
        onClick={handleExport}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={12} sx={{ color: DOCKER_BLUE }} />
          ) : (
            <Archive sx={{ fontSize: 14 }} />
          )
        }
        sx={{
          height: 28,
          fontSize: "0.68rem",
          fontWeight: 500,
          px: 1.25,
          borderColor: BORDER,
          color: TEXT_SECONDARY,
          textTransform: "none",
          "&:hover": {
            borderColor: DOCKER_BLUE,
            color: DOCKER_BLUE,
            background: `rgba(13,183,237,0.06)`,
          },
        }}
      >
        Helm ZIP
      </Button>
    </Tooltip>
  );
}
