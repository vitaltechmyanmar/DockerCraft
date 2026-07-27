"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  WarningAmber,
} from "@mui/icons-material";
import { parseDockerfile } from "@/lib/parsers/dockerfile-parser";
import { DockerfileConfig } from "@/types/dockerfile";

const DOCKER_BLUE = "#0db7ed";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_SECONDARY = "#7d8fa3";

interface ImportDockerfileDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (partial: Partial<DockerfileConfig>) => void;
}

export function ImportDockerfileDialog({
  open,
  onClose,
  onImport,
}: ImportDockerfileDialogProps) {
  const [content, setContent] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [parsed, setParsed] = useState<Partial<DockerfileConfig> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleParse = useCallback(() => {
    const result = parseDockerfile(content);
    setParsed(result.config);
    setWarnings(result.warnings);
  }, [content]);

  const handleApply = useCallback(() => {
    if (parsed) {
      onImport(parsed);
      onClose();
      setContent("");
      setParsed(null);
      setWarnings([]);
    }
  }, [parsed, onImport, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    setContent("");
    setParsed(null);
    setWarnings([]);
  }, [onClose]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent((ev.target?.result as string) ?? "");
        setParsed(null);
        setWarnings([]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: "var(--bg-panel)",
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(13,183,237,0.12)`,
            border: `1px solid rgba(13,183,237,0.25)`,
          }}
        >
          <FileUploadIcon sx={{ fontSize: 16, color: DOCKER_BLUE }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
            Import Dockerfile
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: TEXT_SECONDARY }}>
            Paste or drag-and-drop a Dockerfile to auto-populate the form
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Drop zone / textarea */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            position: "relative",
            border: `2px dashed`,
            borderColor: isDragging ? DOCKER_BLUE : BORDER,
            borderRadius: 1.5,
            background: isDragging ? `rgba(13,183,237,0.05)` : BG_ELEVATED,
            transition: "all 0.2s",
            p: 0,
          }}
        >
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setParsed(null);
              setWarnings([]);
            }}
            placeholder={`# Paste your Dockerfile here, or drag & drop a file\n\nFROM node:20-alpine\nWORKDIR /app\n...`}
            style={{
              width: "100%",
              minHeight: 240,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "14px 16px",
              fontFamily: "'SFMono-Regular', Consolas, monospace",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--text-primary)",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {isDragging && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Typography sx={{ color: DOCKER_BLUE, fontWeight: 600 }}>
                Drop file to import
              </Typography>
            </Box>
          )}
        </Box>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Alert
            severity="warning"
            icon={<WarningAmber fontSize="small" />}
            sx={{ mt: 1.5, background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}
          >
            <AlertTitle sx={{ fontSize: "0.8rem" }}>Parse warnings</AlertTitle>
            {warnings.map((w, i) => (
              <Typography key={i} variant="caption" sx={{ display: "block" }}>{w}</Typography>
            ))}
          </Alert>
        )}

        {/* Parse preview */}
        {parsed && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 1,
              background: "rgba(63,185,80,0.06)",
              border: "1px solid rgba(63,185,80,0.2)",
            }}
          >
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#3fb950", mb: 0.75 }}>
              ✓ Parsed successfully — click Apply to update the form
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {Object.entries(parsed)
                .filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
                .map(([k, v]) => (
                  <Box
                    key={k}
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.5,
                      background: BG_ELEVATED,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.68rem", color: TEXT_SECONDARY }}>
                      <span style={{ color: DOCKER_BLUE }}>{k}</span>:{" "}
                      {Array.isArray(v) ? `${v.length} item(s)` : String(v)}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: TEXT_SECONDARY }} size="small">
          Cancel
        </Button>
        {!parsed ? (
          <Button
            onClick={handleParse}
            disabled={!content.trim()}
            variant="outlined"
            size="small"
            sx={{
              borderColor: DOCKER_BLUE,
              color: DOCKER_BLUE,
              "&:hover": { background: "rgba(13,183,237,0.08)" },
            }}
          >
            Parse
          </Button>
        ) : (
          <Button
            onClick={handleApply}
            variant="contained"
            size="small"
            sx={{
              background: DOCKER_BLUE,
              "&:hover": { background: "#0aa8d4" },
            }}
          >
            Apply to Form
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
