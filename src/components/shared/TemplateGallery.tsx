"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  AutoAwesome,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { QUICK_START_TEMPLATES, QuickStartTemplate } from "@/lib/templates/quick-start";
import { DockerfileConfig } from "@/types/dockerfile";
import { ComposeConfig } from "@/types/compose";

const DOCKER_BLUE = "#0db7ed";
const BG_PANEL = "#161b22";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_PRIMARY = "#e6edf3";
const TEXT_SECONDARY = "#7d8fa3";

interface TemplateGalleryProps {
  onSelect: (
    dockerfileConfig: Partial<DockerfileConfig>,
    composeConfig: Partial<ComposeConfig>
  ) => void;
}

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [expanded, setExpanded] = useState(true);
  const [applied, setApplied] = useState<string | null>(null);

  const handleSelect = (tpl: QuickStartTemplate) => {
    onSelect(tpl.dockerfileConfig, tpl.composeConfig);
    setApplied(tpl.id);
    setTimeout(() => setApplied(null), 2000);
  };

  return (
    <Box
      sx={{
        maxWidth: 1600,
        mx: "auto",
        px: { xs: 1.5, sm: 2, lg: 3 },
        py: 1,
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 1.25 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesome sx={{ fontSize: 14, color: DOCKER_BLUE }} />
          <Typography
            sx={{ fontSize: "0.78rem", fontWeight: 600, color: TEXT_PRIMARY }}
          >
            Quick-Start Templates
          </Typography>
          <Chip
            label="6 stacks"
            size="small"
            sx={{
              height: 18,
              fontSize: "0.62rem",
              background: alpha(DOCKER_BLUE, 0.1),
              color: DOCKER_BLUE,
              border: `1px solid ${alpha(DOCKER_BLUE, 0.2)}`,
            }}
          />
        </Box>
        <Tooltip title={expanded ? "Collapse" : "Expand"}>
          <IconButton
            size="small"
            onClick={() => setExpanded((p) => !p)}
            sx={{ color: TEXT_SECONDARY, p: 0.5 }}
          >
            {expanded ? (
              <ExpandLess sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMore sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Cards row */}
      {expanded && (
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            overflowX: "auto",
            pb: 0.5,
            // hide scrollbar but keep scrollability
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              background: BORDER,
              borderRadius: 100,
            },
          }}
        >
          {QUICK_START_TEMPLATES.map((tpl) => {
            const isApplied = applied === tpl.id;
            return (
              <Box
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                sx={{
                  flexShrink: 0,
                  width: 180,
                  p: 1.5,
                  borderRadius: 1.5,
                  background: isApplied
                    ? "rgba(63,185,80,0.08)"
                    : BG_PANEL,
                  border: `1px solid`,
                  borderColor: isApplied
                    ? "rgba(63,185,80,0.3)"
                    : BORDER,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    background: alpha(DOCKER_BLUE, 0.06),
                    borderColor: alpha(DOCKER_BLUE, 0.35),
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
                  },
                }}
              >
                {/* Icon + Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: BG_ELEVATED,
                      border: `1px solid ${BORDER}`,
                      fontSize: "15px",
                      flexShrink: 0,
                    }}
                  >
                    {tpl.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: isApplied ? "#3fb950" : TEXT_PRIMARY,
                      lineHeight: 1.2,
                    }}
                  >
                    {isApplied ? "✓ Applied!" : tpl.name}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: TEXT_SECONDARY,
                    lineHeight: 1.4,
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tpl.description}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.4 }}>
                  {tpl.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.58rem",
                        background: BG_ELEVATED,
                        color: TEXT_SECONDARY,
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
