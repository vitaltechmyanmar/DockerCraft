"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  MenuBook,
  GitHub,
  FiberManualRecord,
  Description as DescriptionIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
  Visibility,
} from "@mui/icons-material";
import { DockerfileForm } from "@/components/dockerfile/DockerfileForm";
import { DockerfilePreview } from "@/components/dockerfile/DockerfilePreview";
import { ComposeForm } from "@/components/compose/ComposeForm";
import { ComposePreview } from "@/components/compose/ComposePreview";
import { DockerDocsDrawer } from "@/components/shared/DockerDocsDrawer";
import { DockerfileConfig } from "@/types/dockerfile";
import { ComposeConfig } from "@/types/compose";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";

// ─── Default Configs ──────────────────────────────────────────────

const DEFAULT_DOCKERFILE_CONFIG: DockerfileConfig = {
  framework: "nodejs",
  version: "20",
  baseImage: "alpine",
  workdir: "/app",
  port: 3000,
  envVars: [],
  buildCommand: "npm ci --omit=dev",
  startCommand: "node server.js",
  multiStage: true,
  nonRootUser: true,
  healthCheck: false,
  healthCheckPath: "/health",
  healthCheckInterval: 30,
};

const DEFAULT_COMPOSE_CONFIG: ComposeConfig = {
  version: "3.9",
  projectName: "my-project",
  services: [
    {
      id: generateId(),
      name: "app",
      preset: "custom",
      image: "",
      useDockerfile: true,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 3000, container: 3000 }],
      environment: [
        { key: "NODE_ENV", value: "production" },
        { key: "DATABASE_URL", value: "postgresql://postgres:password@db:5432/mydb" },
      ],
      volumes: [],
      dependsOn: ["db"],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-app",
      command: "",
    },
    {
      id: generateId(),
      name: "db",
      preset: "postgres",
      image: "postgres:16-alpine",
      useDockerfile: false,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 5432, container: 5432 }],
      environment: [
        { key: "POSTGRES_USER", value: "postgres" },
        { key: "POSTGRES_PASSWORD", value: "password" },
        { key: "POSTGRES_DB", value: "mydb" },
      ],
      volumes: [{ source: "postgres_data", target: "/var/lib/postgresql/data" }],
      dependsOn: [],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-db",
      command: "",
    },
  ],
  networks: ["app-network"],
  volumes: ["postgres_data"],
};

type AppTab = "dockerfile" | "compose";
type MobileView = "config" | "preview";

const DOCKER_BLUE = "#0db7ed";
const BG_PANEL = "#161b22";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_PRIMARY = "#e6edf3";
const TEXT_SECONDARY = "#7d8fa3";

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("dockerfile");
  const [mobileView, setMobileView] = useState<MobileView>("config");
  const [dockerfileConfig, setDockerfileConfig] = useState<DockerfileConfig>(DEFAULT_DOCKERFILE_CONFIG);
  const [composeConfig, setComposeConfig] = useState<ComposeConfig>(DEFAULT_COMPOSE_CONFIG);
  const [docsOpen, setDocsOpen] = useState(false);

  const STATS = [
    { v: "15", l: "Frameworks" },
    { v: "8", l: "Presets" },
    { v: "v1.3", l: "Version" },
  ];

  return (
    <Box
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f1117" }}
    >
      {/* ─── MUI AppBar ───────────────────────────────────────────── */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            maxWidth: 1600,
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            gap: 2,
            minHeight: "52px !important",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: alpha(DOCKER_BLUE, 0.15),
                border: `1px solid ${alpha(DOCKER_BLUE, 0.3)}`,
                fontSize: "15px",
              }}
            >
              🐳
            </Box>
            <Box>
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: TEXT_PRIMARY,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                DockerCraft
              </Typography>
              <Typography
                component="span"
                sx={{
                  display: { xs: "none", md: "inline" },
                  ml: 1.5,
                  fontSize: "0.72rem",
                  color: TEXT_SECONDARY,
                }}
              >
                Dockerfile &amp; Compose Generator
              </Typography>
            </Box>
          </Box>

          {/* MUI Tabs for Desktop */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v as AppTab)}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: DOCKER_BLUE,
                  height: 2,
                },
              }}
            >
              <Tab
                value="dockerfile"
                icon={<DescriptionIcon sx={{ fontSize: 15 }} />}
                iconPosition="start"
                label="Dockerfile"
                sx={{
                  gap: 0.5,
                  minHeight: 52,
                  px: 2,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: TEXT_SECONDARY,
                  "&.Mui-selected": { color: DOCKER_BLUE },
                }}
              />
              <Tab
                value="compose"
                icon={<LayersIcon sx={{ fontSize: 15 }} />}
                iconPosition="start"
                label="Compose"
                sx={{
                  gap: 0.5,
                  minHeight: 52,
                  px: 2,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: TEXT_SECONDARY,
                  "&.Mui-selected": { color: DOCKER_BLUE },
                }}
              />
            </Tabs>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Stats chips (md+) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.75 }}>
            {STATS.map(({ v, l }) => (
              <Chip
                key={l}
                label={
                  <span>
                    <span style={{ color: DOCKER_BLUE, fontWeight: 700 }}>{v}</span>
                    {" "}{l}
                  </span>
                }
                size="small"
                sx={{
                  background: BG_ELEVATED,
                  border: `1px solid ${BORDER}`,
                  color: TEXT_SECONDARY,
                  fontSize: "0.68rem",
                  height: 22,
                }}
              />
            ))}
          </Box>

          {/* Live badge */}
          <Chip
            icon={<FiberManualRecord sx={{ fontSize: "8px !important", color: "#3fb950 !important", animation: "pulse 2s infinite" }} />}
            label="Live"
            size="small"
            color="success"
            sx={{ display: { xs: "none", sm: "flex" }, fontSize: "0.7rem", height: 22 }}
          />

          {/* Docs Button */}
          <Tooltip title="Docker Reference Docs" placement="bottom">
            <IconButton
              size="small"
              onClick={() => setDocsOpen(true)}
              sx={{
                color: TEXT_SECONDARY,
                border: `1px solid ${BORDER}`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                gap: 0.5,
                height: 30,
                "&:hover": {
                  color: DOCKER_BLUE,
                  borderColor: alpha(DOCKER_BLUE, 0.4),
                  background: alpha(DOCKER_BLUE, 0.08),
                },
              }}
            >
              <MenuBook sx={{ fontSize: 15 }} />
              <Typography
                component="span"
                sx={{ fontSize: "0.72rem", fontWeight: 500, display: { xs: "none", sm: "inline" } }}
              >
                Docs
              </Typography>
            </IconButton>
          </Tooltip>

          {/* GitHub */}
          <Tooltip title="View on GitHub" placement="bottom">
            <IconButton
              size="small"
              component="a"
              href="https://github.com/vitaltechmyanmar/DockerCraft"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: TEXT_SECONDARY, "&:hover": { color: TEXT_PRIMARY } }}
            >
              <GitHub sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Toolbar>

        {/* ─── Sub-header ─────────────────────────────────────────── */}
        <Box
          sx={{
            borderTop: `1px solid ${alpha(BORDER, 0.6)}`,
            background: alpha(BG_ELEVATED, 0.5),
          }}
        >
          <Box
            sx={{
              maxWidth: 1600,
              mx: "auto",
              px: { xs: 2, sm: 3 },
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
              Generate production-ready Docker configurations instantly
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
                v1.3.0 · MIT License
              </Typography>
            </Box>
          </Box>
        </Box>
      </AppBar>

      {/* ─── Mobile Tab Switcher ──────────────────────────────────── */}
      <Box sx={{ display: { xs: "block", sm: "none" }, px: 1.5, pt: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            p: 0.5,
            borderRadius: 1,
            background: BG_PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <MobileTabBtn active={activeTab === "dockerfile"} onClick={() => setActiveTab("dockerfile")} label="Dockerfile" />
          <MobileTabBtn active={activeTab === "compose"} onClick={() => setActiveTab("compose")} label="Compose" />
        </Box>
      </Box>

      {/* ─── Mobile View Toggle ───────────────────────────────────── */}
      <Box sx={{ display: { xs: "flex", lg: "none" }, px: 1.5, pt: 1, gap: 0.5, p: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            p: 0.5,
            borderRadius: 1,
            background: BG_PANEL,
            border: `1px solid ${BORDER}`,
            mx: 1.5,
            mt: 1,
          }}
        >
          <MobileViewBtn
            active={mobileView === "config"}
            onClick={() => setMobileView("config")}
            icon={<SettingsIcon sx={{ fontSize: 13 }} />}
            label="Configure"
          />
          <MobileViewBtn
            active={mobileView === "preview"}
            onClick={() => setMobileView("preview")}
            icon={<Visibility sx={{ fontSize: 13 }} />}
            label="Preview"
          />
        </Box>
      </Box>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 1600,
          mx: "auto",
          width: "100%",
          px: { xs: 1.5, sm: 2, lg: 3 },
          py: 2,
        }}
      >
        {activeTab === "dockerfile" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 1.5,
              height: "100%",
            }}
          >
            {/* Config Panel */}
            <Paper
              sx={{
                display: { xs: mobileView === "preview" ? "none" : "block", lg: "block" },
                overflow: "hidden",
                background: BG_PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader
                icon={<SettingsIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />}
                title="Configuration"
                subtitle="Dockerfile options"
              />
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <DockerfileForm config={dockerfileConfig} onChange={setDockerfileConfig} />
              </Box>
            </Paper>

            {/* Preview Panel */}
            <Paper
              sx={{
                display: { xs: mobileView === "config" ? "none" : "flex", lg: "flex" },
                flexDirection: "column",
                overflow: "hidden",
                minHeight: { xs: 500, sm: 600 },
                background: BG_PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader
                icon={<DescriptionIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />}
                title="Generated Output"
                subtitle="Real-time preview"
                live
              />
              <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 2, sm: 2.5 }, pt: 0 }}>
                <DockerfilePreview config={dockerfileConfig} />
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 1.5,
              height: "100%",
            }}
          >
            {/* Config Panel */}
            <Paper
              sx={{
                display: { xs: mobileView === "preview" ? "none" : "block", lg: "block" },
                overflow: "hidden",
                background: BG_PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader
                icon={<LayersIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />}
                title="Services"
                subtitle="Multi-service stack"
              />
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <ComposeForm config={composeConfig} onChange={setComposeConfig} />
              </Box>
            </Paper>

            {/* Preview Panel */}
            <Paper
              sx={{
                display: { xs: mobileView === "config" ? "none" : "flex", lg: "flex" },
                flexDirection: "column",
                overflow: "hidden",
                minHeight: { xs: 500, sm: 600 },
                background: BG_PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader
                icon={<DescriptionIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />}
                title="Generated Output"
                subtitle="Real-time preview"
                live
              />
              <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 2, sm: 2.5 }, pt: 0 }}>
                <ComposePreview config={composeConfig} />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${BORDER}`,
          background: BG_PANEL,
        }}
      >
        <Box
          sx={{
            maxWidth: 1600,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
            Built with{" "}
            <Box component="span" sx={{ color: DOCKER_BLUE }}>Next.js</Box>
            {" · "}
            <Box component="span" sx={{ color: DOCKER_BLUE }}>MUI</Box>
            {" · "}
            <Box component="span" sx={{ color: DOCKER_BLUE }}>Tailwind CSS</Box>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>v1.3.0</Typography>
            <Typography variant="caption" sx={{ color: BORDER }}>·</Typography>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>MIT License</Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Docker Docs Drawer ───────────────────────────────────── */}
      <DockerDocsDrawer open={docsOpen} onClose={() => setDocsOpen(false)} />
    </Box>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function PanelHeader({
  icon,
  title,
  subtitle,
  live,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  live?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: alpha(DOCKER_BLUE, 0.12),
          border: `1px solid ${alpha(DOCKER_BLUE, 0.25)}`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.8rem", lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: "0.68rem" }}>
          {subtitle}
        </Typography>
      </Box>
      {live && (
        <Chip
          icon={<FiberManualRecord sx={{ fontSize: "7px !important", color: "#3fb950 !important" }} />}
          label="Live"
          size="small"
          color="success"
          sx={{ fontSize: "0.65rem", height: 20 }}
        />
      )}
    </Box>
  );
}

function MobileTabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: 1,
        py: 1,
        px: 2,
        borderRadius: 0.75,
        border: "1px solid",
        borderColor: active ? alpha(DOCKER_BLUE, 0.4) : "transparent",
        background: active ? alpha(DOCKER_BLUE, 0.12) : "transparent",
        color: active ? DOCKER_BLUE : TEXT_SECONDARY,
        fontSize: "0.8rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
        "&:hover": {
          color: active ? DOCKER_BLUE : TEXT_PRIMARY,
        },
      }}
    >
      {label}
    </Box>
  );
}

function MobileViewBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        py: 0.75,
        px: 1.5,
        borderRadius: 0.75,
        border: "1px solid",
        borderColor: active ? alpha(DOCKER_BLUE, 0.4) : "transparent",
        background: active ? alpha(DOCKER_BLUE, 0.12) : "transparent",
        color: active ? DOCKER_BLUE : TEXT_SECONDARY,
        fontSize: "0.75rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {icon}
      {label}
    </Box>
  );
}
