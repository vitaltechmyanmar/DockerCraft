"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
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
  Snackbar,
  Alert,
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
  Share,
  FileUpload,
  LightMode,
  DarkMode,
  Hub as HubIcon,
} from "@mui/icons-material";
import { DockerfileForm } from "@/components/dockerfile/DockerfileForm";
import { DockerfilePreview } from "@/components/dockerfile/DockerfilePreview";
import { ImportDockerfileDialog } from "@/components/dockerfile/ImportDockerfileDialog";
import { ComposeForm } from "@/components/compose/ComposeForm";
import { ComposePreview } from "@/components/compose/ComposePreview";
import { KubernetesPreview } from "@/components/kubernetes/KubernetesPreview";
import { DockerDocsDrawer } from "@/components/shared/DockerDocsDrawer";
import { TemplateGallery } from "@/components/shared/TemplateGallery";
import { DockerfileConfig } from "@/types/dockerfile";
import { ComposeConfig } from "@/types/compose";
import { cn } from "@/lib/utils";
import { generateId, shareUrl, decodeConfig } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

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

type AppTab = "dockerfile" | "compose" | "kubernetes";
type MobileView = "config" | "preview";

export default function Home() {
  const { theme, toggle: toggleTheme } = useTheme();

  // ── Read URL params on first render ──────────────────────────────
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tab");
      if (t === "compose" || t === "kubernetes") return t;
    }
    return "dockerfile";
  });

  const [dockerfileConfig, setDockerfileConfig] = useState<DockerfileConfig>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("config");
      const tab = p.get("tab") ?? "dockerfile";
      if (raw && tab === "dockerfile") {
        const decoded = decodeConfig<DockerfileConfig>(raw);
        if (decoded) return { ...DEFAULT_DOCKERFILE_CONFIG, ...decoded };
      }
    }
    return DEFAULT_DOCKERFILE_CONFIG;
  });

  const [composeConfig, setComposeConfig] = useState<ComposeConfig>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("config");
      const tab = p.get("tab") ?? "dockerfile";
      if (raw && (tab === "compose" || tab === "kubernetes")) {
        const decoded = decodeConfig<ComposeConfig>(raw);
        if (decoded) return { ...DEFAULT_COMPOSE_CONFIG, ...decoded };
      }
    }
    return DEFAULT_COMPOSE_CONFIG;
  });

  const [mobileView, setMobileView] = useState<MobileView>("config");
  const [docsOpen, setDocsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message: string, severity: "success" | "error" = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  // ── Template Gallery handler ──────────────────────────────────────
  const handleTemplateSelect = useCallback(
    (dockerPartial: Partial<DockerfileConfig>, composePartial: Partial<ComposeConfig>) => {
      setDockerfileConfig((prev) => ({ ...prev, ...dockerPartial }));
      setComposeConfig((prev) => ({ ...prev, ...composePartial }));
      showToast("Template applied to both tabs!", "success");
    },
    [showToast]
  );

  // ── Import handler ───────────────────────────────────────────────
  const handleImport = useCallback(
    (partial: Partial<DockerfileConfig>) => {
      setDockerfileConfig((prev) => ({ ...prev, ...partial }));
      showToast("Dockerfile imported successfully!", "success");
    },
    [showToast]
  );

  // ── Share handler ────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const config = activeTab === "dockerfile" ? dockerfileConfig : composeConfig;
    const ok = await shareUrl(activeTab, config);
    showToast(ok ? "Link copied to clipboard!" : "URL updated (clipboard unavailable)", ok ? "success" : "error");
  }, [activeTab, dockerfileConfig, composeConfig, showToast]);

  // ── Preview download ref forwarding ──────────────────────────────
  // Keyboard shortcut Ctrl+D triggers a synthetic click on the active download button
  const downloadRef = useCallback(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-action="download"]');
    btn?.click();
  }, []);

  // ── Keyboard shortcuts ───────────────────────────────────────────
  useKeyboardShortcuts(
    useMemo(
      () => ({
        onDockerfileTab: () => setActiveTab("dockerfile"),
        onComposeTab: () => setActiveTab("compose"),
        onKubernetesTab: () => setActiveTab("kubernetes"),
        onCopy: () => {
          const btn = document.querySelector<HTMLButtonElement>('[data-action="copy"]');
          btn?.click();
        },
        onDownload: downloadRef,
        onShare: handleShare,
        onImport: () => setImportOpen(true),
        onToggleDocs: () => setDocsOpen((p) => !p),
      }),
      [handleShare, downloadRef]
    )
  );

  const DOCKER_BLUE = theme === "dark" ? "#0db7ed" : "#0099cc";
  const BG_PANEL = "var(--bg-panel)";
  const BG_ELEVATED = "var(--bg-elevated)";
  const BORDER = "var(--border)";
  const TEXT_PRIMARY = "var(--text-primary)";
  const TEXT_SECONDARY = "var(--text-muted)";

  const STATS = [
    { v: "15", l: "Frameworks" },
    { v: "8", l: "Presets" },
    { v: "v2.0", l: "Version" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>

      {/* ─── MUI AppBar ───────────────────────────────────────────── */}
      <AppBar position="sticky" elevation={0} sx={{ background: "var(--bg-panel)", borderBottom: `1px solid var(--border)` }}>
        <Toolbar
          sx={{
            maxWidth: 1600,
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            gap: 1.5,
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
                sx={{ fontWeight: 700, fontSize: "0.9rem", color: TEXT_PRIMARY, lineHeight: 1, letterSpacing: "-0.01em" }}
              >
                DockerCraft
              </Typography>
              <Typography
                component="span"
                sx={{ display: { xs: "none", md: "inline" }, ml: 1.5, fontSize: "0.72rem", color: TEXT_SECONDARY }}
              >
                Dockerfile &amp; Compose Generator
              </Typography>
            </Box>
          </Box>

          {/* Desktop Tabs */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: 1.5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v as AppTab)}
              sx={{ "& .MuiTabs-indicator": { backgroundColor: DOCKER_BLUE, height: 2 } }}
            >
              {[
                { value: "dockerfile", icon: <DescriptionIcon sx={{ fontSize: 14 }} />, label: "Dockerfile" },
                { value: "compose",    icon: <LayersIcon sx={{ fontSize: 14 }} />,     label: "Compose"    },
                { value: "kubernetes", icon: <HubIcon sx={{ fontSize: 14 }} />,        label: "Kubernetes" },
              ].map(({ value, icon, label }) => (
                <Tab
                  key={value}
                  value={value}
                  icon={icon}
                  iconPosition="start"
                  label={label}
                  sx={{
                    gap: 0.5,
                    minHeight: 52,
                    px: 1.75,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    textTransform: "none",
                    color: TEXT_SECONDARY,
                    "&.Mui-selected": { color: DOCKER_BLUE },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Stats chips */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.75 }}>
            {STATS.map(({ v, l }) => (
              <Chip
                key={l}
                label={
                  <span>
                    <span style={{ color: DOCKER_BLUE, fontWeight: 700 }}>{v}</span> {l}
                  </span>
                }
                size="small"
                sx={{
                  background: BG_ELEVATED,
                  border: `1px solid var(--border)`,
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

          {/* Share */}
          <Tooltip title="Share config link  (Ctrl+Shift+S)">
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                color: TEXT_SECONDARY,
                border: `1px solid var(--border)`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                gap: 0.5,
                height: 30,
                "&:hover": { color: DOCKER_BLUE, borderColor: alpha(DOCKER_BLUE, 0.4), background: alpha(DOCKER_BLUE, 0.08) },
              }}
            >
              <Share sx={{ fontSize: 14 }} />
              <Typography component="span" sx={{ fontSize: "0.72rem", fontWeight: 500, display: { xs: "none", sm: "inline" } }}>
                Share
              </Typography>
            </IconButton>
          </Tooltip>

          {/* Import (Dockerfile tab only) */}
          {activeTab === "dockerfile" && (
            <Tooltip title="Import Dockerfile  (Ctrl+I)">
              <IconButton
                size="small"
                onClick={() => setImportOpen(true)}
                sx={{
                  color: TEXT_SECONDARY,
                  border: `1px solid var(--border)`,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  gap: 0.5,
                  height: 30,
                  "&:hover": { color: DOCKER_BLUE, borderColor: alpha(DOCKER_BLUE, 0.4), background: alpha(DOCKER_BLUE, 0.08) },
                }}
              >
                <FileUpload sx={{ fontSize: 14 }} />
                <Typography component="span" sx={{ fontSize: "0.72rem", fontWeight: 500, display: { xs: "none", sm: "inline" } }}>
                  Import
                </Typography>
              </IconButton>
            </Tooltip>
          )}

          {/* Theme toggle */}
          <Tooltip title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              size="small"
              onClick={toggleTheme}
              sx={{ color: TEXT_SECONDARY, "&:hover": { color: TEXT_PRIMARY } }}
            >
              {theme === "dark" ? <LightMode sx={{ fontSize: 18 }} /> : <DarkMode sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>

          {/* Docs */}
          <Tooltip title="Docker Reference Docs  (Ctrl+/)">
            <IconButton
              size="small"
              onClick={() => setDocsOpen(true)}
              sx={{
                color: TEXT_SECONDARY,
                border: `1px solid var(--border)`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                gap: 0.5,
                height: 30,
                "&:hover": { color: DOCKER_BLUE, borderColor: alpha(DOCKER_BLUE, 0.4), background: alpha(DOCKER_BLUE, 0.08) },
              }}
            >
              <MenuBook sx={{ fontSize: 15 }} />
              <Typography component="span" sx={{ fontSize: "0.72rem", fontWeight: 500, display: { xs: "none", sm: "inline" } }}>
                Docs
              </Typography>
            </IconButton>
          </Tooltip>

          {/* GitHub */}
          <Tooltip title="View on GitHub">
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

        {/* Sub-header */}
        <Box sx={{ borderTop: `1px solid ${alpha("#2a3344", 0.6)}`, background: alpha("#1c2230", 0.5) }}>
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
              Generate production-ready Docker configurations instantly · Ctrl+1/2/3 to switch tabs
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
                v2.0.0 · MIT License
              </Typography>
            </Box>
          </Box>
        </Box>
      </AppBar>

      {/* ─── Mobile Tab Switcher ──────────────────────────────────── */}
      <Box sx={{ display: { xs: "block", sm: "none" }, px: 1.5, pt: 1.5 }}>
        <Box sx={{ display: "flex", gap: 0.5, p: 0.5, borderRadius: 1, background: BG_PANEL, border: `1px solid var(--border)` }}>
          {[
            { id: "dockerfile" as AppTab, label: "Dockerfile" },
            { id: "compose"    as AppTab, label: "Compose" },
            { id: "kubernetes" as AppTab, label: "K8s" },
          ].map(({ id, label }) => (
            <MobileTabBtn key={id} active={activeTab === id} onClick={() => setActiveTab(id)} label={label} DOCKER_BLUE={DOCKER_BLUE} TEXT_SECONDARY={TEXT_SECONDARY} />
          ))}
        </Box>
      </Box>

      {/* ─── Mobile View Toggle ───────────────────────────────────── */}
      <Box sx={{ display: { xs: "flex", lg: "none" }, px: 1.5, pt: 1, gap: 0.5, p: 0.5 }}>
        <Box sx={{ display: "flex", gap: 0.5, p: 0.5, borderRadius: 1, background: BG_PANEL, border: `1px solid var(--border)`, mx: 1.5, mt: 1 }}>
          <MobileViewBtn active={mobileView === "config"} onClick={() => setMobileView("config")} icon={<SettingsIcon sx={{ fontSize: 13 }} />} label="Configure" DOCKER_BLUE={DOCKER_BLUE} TEXT_SECONDARY={TEXT_SECONDARY} />
          <MobileViewBtn active={mobileView === "preview"} onClick={() => setMobileView("preview")} icon={<Visibility sx={{ fontSize: 13 }} />} label="Preview" DOCKER_BLUE={DOCKER_BLUE} TEXT_SECONDARY={TEXT_SECONDARY} />
        </Box>
      </Box>

      {/* ─── Template Gallery ─────────────────────────────────────── */}
      <Box sx={{ borderBottom: `1px solid var(--border)`, background: "var(--bg-panel)", pt: 1, pb: 1 }}>
        <TemplateGallery onSelect={handleTemplateSelect} />
      </Box>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{ flex: 1, maxWidth: 1600, mx: "auto", width: "100%", px: { xs: 1.5, sm: 2, lg: 3 }, py: 2 }}
      >
        {activeTab === "dockerfile" && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
            <Paper
              sx={{
                display: { xs: mobileView === "preview" ? "none" : "block", lg: "block" },
                overflow: "hidden",
                background: BG_PANEL,
                border: `1px solid var(--border)`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader icon={<SettingsIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />} title="Configuration" subtitle="Dockerfile options" DOCKER_BLUE={DOCKER_BLUE} TEXT_PRIMARY={TEXT_PRIMARY} TEXT_SECONDARY={TEXT_SECONDARY} BORDER={BORDER} />
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <DockerfileForm config={dockerfileConfig} onChange={setDockerfileConfig} />
              </Box>
            </Paper>
            <Paper
              sx={{
                display: { xs: mobileView === "config" ? "none" : "flex", lg: "flex" },
                flexDirection: "column",
                overflow: "hidden",
                minHeight: { xs: 500, sm: 600 },
                background: BG_PANEL,
                border: `1px solid var(--border)`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader icon={<DescriptionIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />} title="Generated Output" subtitle="Real-time preview" live DOCKER_BLUE={DOCKER_BLUE} TEXT_PRIMARY={TEXT_PRIMARY} TEXT_SECONDARY={TEXT_SECONDARY} BORDER={BORDER} />
              <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 2, sm: 2.5 }, pt: 0 }}>
                <DockerfilePreview config={dockerfileConfig} />
              </Box>
            </Paper>
          </Box>
        )}

        {activeTab === "compose" && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
            <Paper
              sx={{
                display: { xs: mobileView === "preview" ? "none" : "block", lg: "block" },
                overflow: "hidden",
                background: BG_PANEL,
                border: `1px solid var(--border)`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader icon={<LayersIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />} title="Services" subtitle="Multi-service stack" DOCKER_BLUE={DOCKER_BLUE} TEXT_PRIMARY={TEXT_PRIMARY} TEXT_SECONDARY={TEXT_SECONDARY} BORDER={BORDER} />
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <ComposeForm config={composeConfig} onChange={setComposeConfig} />
              </Box>
            </Paper>
            <Paper
              sx={{
                display: { xs: mobileView === "config" ? "none" : "flex", lg: "flex" },
                flexDirection: "column",
                overflow: "hidden",
                minHeight: { xs: 500, sm: 600 },
                background: BG_PANEL,
                border: `1px solid var(--border)`,
                borderRadius: 1.5,
              }}
            >
              <PanelHeader icon={<DescriptionIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />} title="Generated Output" subtitle="Real-time preview" live DOCKER_BLUE={DOCKER_BLUE} TEXT_PRIMARY={TEXT_PRIMARY} TEXT_SECONDARY={TEXT_SECONDARY} BORDER={BORDER} />
              <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 2, sm: 2.5 }, pt: 0 }}>
                <ComposePreview config={composeConfig} />
              </Box>
            </Paper>
          </Box>
        )}

        {activeTab === "kubernetes" && (
          <Paper
            sx={{
              overflow: "hidden",
              minHeight: { xs: 500, sm: 700 },
              background: BG_PANEL,
              border: `1px solid var(--border)`,
              borderRadius: 1.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PanelHeader
              icon={<HubIcon sx={{ fontSize: 13, color: DOCKER_BLUE }} />}
              title="Kubernetes & Helm"
              subtitle="k8s manifests · Helm chart — generated from your Compose config"
              live
              DOCKER_BLUE={DOCKER_BLUE} TEXT_PRIMARY={TEXT_PRIMARY} TEXT_SECONDARY={TEXT_SECONDARY} BORDER={BORDER}
            />
            <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 2, sm: 2.5 }, pt: 1 }}>
              <KubernetesPreview config={composeConfig} />
            </Box>
          </Paper>
        )}
      </Box>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <Box component="footer" sx={{ borderTop: `1px solid var(--border)`, background: BG_PANEL }}>
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
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>v2.0.0</Typography>
            <Typography variant="caption" sx={{ color: "var(--border)" }}>·</Typography>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>MIT License</Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Dialogs & Overlays ───────────────────────────────────── */}
      <DockerDocsDrawer open={docsOpen} onClose={() => setDocsOpen(false)} />
      <ImportDockerfileDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ fontSize: "0.8rem" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function PanelHeader({
  icon, title, subtitle, live, DOCKER_BLUE, TEXT_PRIMARY, TEXT_SECONDARY, BORDER,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  live?: boolean;
  DOCKER_BLUE: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  BORDER: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderBottom: `1px solid ${BORDER}` }}>
      <Box sx={{ width: 24, height: 24, borderRadius: 0.75, display: "flex", alignItems: "center", justifyContent: "center", background: alpha(DOCKER_BLUE, 0.12), border: `1px solid ${alpha(DOCKER_BLUE, 0.25)}`, flexShrink: 0 }}>
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

function MobileTabBtn({ active, onClick, label, DOCKER_BLUE, TEXT_SECONDARY }: {
  active: boolean; onClick: () => void; label: string; DOCKER_BLUE: string; TEXT_SECONDARY: string;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: 1, py: 1, px: 2, borderRadius: 0.75, border: "1px solid",
        borderColor: active ? alpha(DOCKER_BLUE, 0.4) : "transparent",
        background: active ? alpha(DOCKER_BLUE, 0.12) : "transparent",
        color: active ? DOCKER_BLUE : TEXT_SECONDARY,
        fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {label}
    </Box>
  );
}

function MobileViewBtn({ active, onClick, icon, label, DOCKER_BLUE, TEXT_SECONDARY }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; DOCKER_BLUE: string; TEXT_SECONDARY: string;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5,
        py: 0.75, px: 1.5, borderRadius: 0.75, border: "1px solid",
        borderColor: active ? alpha(DOCKER_BLUE, 0.4) : "transparent",
        background: active ? alpha(DOCKER_BLUE, 0.12) : "transparent",
        color: active ? DOCKER_BLUE : TEXT_SECONDARY,
        fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {icon}{label}
    </Box>
  );
}
