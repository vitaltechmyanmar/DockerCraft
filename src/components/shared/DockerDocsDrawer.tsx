"use client";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Link,
  Tooltip,
} from "@mui/material";
import {
  Close,
  ExpandMore,
  OpenInNew,
  Code,
  Description,
  Settings,
  AccountTree,
  Security,
  Layers,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

interface DockerDocsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DOCKER_BLUE = "#0db7ed";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_PRIMARY = "#e6edf3";
const TEXT_SECONDARY = "#7d8fa3";

// ─── Data ──────────────────────────────────────────────────────────

const DOCKERFILE_DIRECTIVES = [
  {
    name: "FROM",
    syntax: "FROM <image>[:<tag>] [AS <name>]",
    description: "Sets the base image. Every valid Dockerfile must start with a FROM instruction.",
    example: "FROM node:20-alpine AS builder",
    docs: "https://docs.docker.com/reference/dockerfile/#from",
    color: "#a78bfa",
  },
  {
    name: "RUN",
    syntax: "RUN <command>",
    description: "Executes commands in a new layer on top of the current image. Chain commands with && to reduce layers.",
    example: "RUN npm ci --omit=dev && npm cache clean --force",
    docs: "https://docs.docker.com/reference/dockerfile/#run",
    color: "#fb923c",
  },
  {
    name: "COPY",
    syntax: "COPY [--chown=<user>:<group>] <src> <dest>",
    description: "Copies new files or directories from the build context or a previous stage into the container.",
    example: "COPY --chown=node:node . .",
    docs: "https://docs.docker.com/reference/dockerfile/#copy",
    color: "#34d399",
  },
  {
    name: "WORKDIR",
    syntax: "WORKDIR /path/to/workdir",
    description: "Sets the working directory for subsequent RUN, CMD, ENTRYPOINT, COPY, and ADD instructions.",
    example: "WORKDIR /app",
    docs: "https://docs.docker.com/reference/dockerfile/#workdir",
    color: DOCKER_BLUE,
  },
  {
    name: "EXPOSE",
    syntax: "EXPOSE <port>[/<protocol>]",
    description: "Informs Docker that the container listens on the specified port at runtime. It's documentation only — does not actually publish the port.",
    example: "EXPOSE 3000",
    docs: "https://docs.docker.com/reference/dockerfile/#expose",
    color: "#f472b6",
  },
  {
    name: "ENV",
    syntax: "ENV <key>=<value>",
    description: "Sets environment variables that persist in the image and running containers.",
    example: 'ENV NODE_ENV=production PORT=3000',
    docs: "https://docs.docker.com/reference/dockerfile/#env",
    color: "#fbbf24",
  },
  {
    name: "CMD",
    syntax: 'CMD ["executable","param1","param2"]',
    description: "Sets the default command to run when a container starts. Can be overridden by docker run arguments.",
    example: 'CMD ["node", "server.js"]',
    docs: "https://docs.docker.com/reference/dockerfile/#cmd",
    color: "#f87171",
  },
  {
    name: "ENTRYPOINT",
    syntax: 'ENTRYPOINT ["executable", "param1"]',
    description: "Configures a container that will run as an executable. Unlike CMD, it cannot easily be overridden.",
    example: 'ENTRYPOINT ["docker-entrypoint.sh"]',
    docs: "https://docs.docker.com/reference/dockerfile/#entrypoint",
    color: "#818cf8",
  },
  {
    name: "ARG",
    syntax: "ARG <name>[=<default value>]",
    description: "Defines a build-time variable. Unlike ENV, ARGs do not persist in the final image.",
    example: "ARG NODE_VERSION=20",
    docs: "https://docs.docker.com/reference/dockerfile/#arg",
    color: "#6ee7b7",
  },
  {
    name: "HEALTHCHECK",
    syntax: "HEALTHCHECK [OPTIONS] CMD <command>",
    description: "Tells Docker how to test a container to check that it is still working.",
    example: "HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/health || exit 1",
    docs: "https://docs.docker.com/reference/dockerfile/#healthcheck",
    color: "#3fb950",
  },
  {
    name: "USER",
    syntax: "USER <user>[:<group>]",
    description: "Sets the user name or UID (and optionally group) to use when running subsequent commands. Best practice: run as non-root.",
    example: "USER node",
    docs: "https://docs.docker.com/reference/dockerfile/#user",
    color: "#94a3b8",
  },
  {
    name: "VOLUME",
    syntax: "VOLUME [\"<path>\"]",
    description: "Creates a mount point and marks it as holding externally-mounted volumes from the host or other containers.",
    example: 'VOLUME ["/data"]',
    docs: "https://docs.docker.com/reference/dockerfile/#volume",
    color: "#60a5fa",
  },
];

const COMPOSE_KEYS = [
  {
    name: "services",
    description: "Top-level key defining each container in the stack. Each service becomes a running container.",
    example: "services:\n  app:\n    image: nginx:alpine",
    docs: "https://docs.docker.com/compose/compose-file/05-services/",
    color: DOCKER_BLUE,
  },
  {
    name: "image",
    description: "Specifies the Docker image to use for the service. Can be a registry image or built from a Dockerfile.",
    example: "image: postgres:16-alpine",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#image",
    color: "#a78bfa",
  },
  {
    name: "build",
    description: "Configuration options applied at build time. Specify context and Dockerfile path.",
    example: "build:\n  context: .\n  dockerfile: Dockerfile",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#build",
    color: "#fb923c",
  },
  {
    name: "ports",
    description: "Exposes container ports to the host. Format: HOST_PORT:CONTAINER_PORT.",
    example: "ports:\n  - \"3000:3000\"",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#ports",
    color: "#f472b6",
  },
  {
    name: "environment",
    description: "Sets environment variables in the container. Can use map or list syntax.",
    example: "environment:\n  NODE_ENV: production\n  DATABASE_URL: postgres://...",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#environment",
    color: "#fbbf24",
  },
  {
    name: "volumes",
    description: "Mounts host paths or named volumes into the container.",
    example: "volumes:\n  - postgres_data:/var/lib/postgresql/data",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#volumes",
    color: "#60a5fa",
  },
  {
    name: "depends_on",
    description: "Expresses startup and shutdown dependencies between services.",
    example: "depends_on:\n  db:\n    condition: service_healthy",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#depends_on",
    color: "#34d399",
  },
  {
    name: "networks",
    description: "Connects services to named networks for inter-service communication.",
    example: "networks:\n  - app-network",
    docs: "https://docs.docker.com/compose/compose-file/06-networks/",
    color: "#f87171",
  },
  {
    name: "restart",
    description: "Defines the restart policy: no | always | on-failure | unless-stopped.",
    example: "restart: unless-stopped",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#restart",
    color: "#94a3b8",
  },
  {
    name: "healthcheck",
    description: "Declares a check to determine whether the service container is 'healthy'.",
    example: "healthcheck:\n  test: [\"CMD\", \"curl\", \"-f\", \"http://localhost\"]\n  interval: 30s",
    docs: "https://docs.docker.com/compose/compose-file/05-services/#healthcheck",
    color: "#3fb950",
  },
];

const QUICK_COMMANDS = [
  { cmd: "docker build -t myapp .", desc: "Build an image from Dockerfile in current directory" },
  { cmd: "docker build --no-cache -t myapp .", desc: "Build without using cache" },
  { cmd: "docker run -p 3000:3000 myapp", desc: "Run container with port mapping" },
  { cmd: "docker run -d --name myapp myapp", desc: "Run container in background (detached)" },
  { cmd: "docker compose up -d", desc: "Start all services in background" },
  { cmd: "docker compose down", desc: "Stop and remove all containers" },
  { cmd: "docker compose logs -f app", desc: "Follow logs for a specific service" },
  { cmd: "docker ps", desc: "List running containers" },
  { cmd: "docker images", desc: "List local images" },
  { cmd: "docker system prune -af", desc: "Remove all unused images, containers, networks" },
];

const EXTERNAL_LINKS = [
  { label: "Dockerfile Reference", url: "https://docs.docker.com/reference/dockerfile/", icon: "📄" },
  { label: "Docker Compose Spec", url: "https://docs.docker.com/compose/compose-file/", icon: "🧩" },
  { label: "Docker Best Practices", url: "https://docs.docker.com/build/building/best-practices/", icon: "✅" },
  { label: "Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/", icon: "🏗️" },
  { label: "Security Best Practices", url: "https://docs.docker.com/build/building/best-practices/#user", icon: "🛡️" },
  { label: "Docker Hub", url: "https://hub.docker.com/", icon: "🐳" },
];

// ─── Sub-components ────────────────────────────────────────────────

function CodeSnippet({ code }: { code: string }) {
  return (
    <Box
      component="pre"
      sx={{
        fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
        fontSize: "0.7rem",
        background: "#0f1117",
        border: `1px solid ${BORDER}`,
        borderRadius: 1,
        p: 1,
        mt: 0.5,
        overflowX: "auto",
        color: DOCKER_BLUE,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {code}
    </Box>
  );
}

function DirectiveCard({ item }: { item: typeof DOCKERFILE_DIRECTIVES[0] }) {
  return (
    <Box
      sx={{
        borderLeft: `3px solid ${item.color}`,
        pl: 1.5,
        py: 0.5,
        mb: 1.5,
        background: alpha(item.color, 0.04),
        borderRadius: "0 4px 4px 0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            color: item.color,
            fontSize: "0.75rem",
          }}
        >
          {item.name}
        </Typography>
        <Tooltip title="View official docs" placement="top">
          <Link
            href={item.docs}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center", ml: "auto" }}
          >
            <OpenInNew sx={{ fontSize: 12, color: TEXT_SECONDARY, "&:hover": { color: DOCKER_BLUE } }} />
          </Link>
        </Tooltip>
      </Box>
      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block", fontSize: "0.7rem", mb: 0.5 }}>
        {item.description}
      </Typography>
      <CodeSnippet code={item.example} />
    </Box>
  );
}

function ComposeKeyCard({ item }: { item: typeof COMPOSE_KEYS[0] }) {
  return (
    <Box
      sx={{
        borderLeft: `3px solid ${item.color}`,
        pl: 1.5,
        py: 0.5,
        mb: 1.5,
        background: alpha(item.color, 0.04),
        borderRadius: "0 4px 4px 0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            color: item.color,
            fontSize: "0.75rem",
          }}
        >
          {item.name}
        </Typography>
        <Tooltip title="View official docs" placement="top">
          <Link
            href={item.docs}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center", ml: "auto" }}
          >
            <OpenInNew sx={{ fontSize: 12, color: TEXT_SECONDARY, "&:hover": { color: DOCKER_BLUE } }} />
          </Link>
        </Tooltip>
      </Box>
      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block", fontSize: "0.7rem", mb: 0.5 }}>
        {item.description}
      </Typography>
      <CodeSnippet code={item.example} />
    </Box>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export function DockerDocsDrawer({ open, onClose }: DockerDocsDrawerProps) {
  const [expanded, setExpanded] = useState<string | false>("dockerfile-directives");

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} variant="temporary">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${BORDER}`,
          gap: 1,
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#161b22",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: alpha(DOCKER_BLUE, 0.15),
            border: `1px solid ${alpha(DOCKER_BLUE, 0.3)}`,
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          🐳
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, lineHeight: 1.2 }}>
            Docker Reference
          </Typography>
          <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
            Directives · Compose keys · Commands
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: TEXT_SECONDARY }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ overflowY: "auto", flex: 1, p: 1 }}>

        {/* External Links */}
        <Box sx={{ p: 1, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
            Official Docs
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
            {EXTERNAL_LINKS.map((link) => (
              <Chip
                key={link.label}
                label={`${link.icon} ${link.label}`}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                size="small"
                sx={{
                  fontSize: "0.68rem",
                  height: 24,
                  background: BG_ELEVATED,
                  border: `1px solid ${BORDER}`,
                  color: TEXT_SECONDARY,
                  "&:hover": {
                    background: alpha(DOCKER_BLUE, 0.1),
                    color: DOCKER_BLUE,
                    borderColor: alpha(DOCKER_BLUE, 0.4),
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Dockerfile Directives Accordion */}
        <Accordion
          expanded={expanded === "dockerfile-directives"}
          onChange={handleChange("dockerfile-directives")}
          sx={{ mb: 0.5 }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: TEXT_SECONDARY }} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Description sx={{ fontSize: 16, color: DOCKER_BLUE }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                Dockerfile Directives
              </Typography>
              <Chip label={DOCKERFILE_DIRECTIVES.length} size="small" color="primary" />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 1, px: 1 }}>
            {DOCKERFILE_DIRECTIVES.map((item) => (
              <DirectiveCard key={item.name} item={item} />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Compose Keys Accordion */}
        <Accordion
          expanded={expanded === "compose-keys"}
          onChange={handleChange("compose-keys")}
          sx={{ mb: 0.5 }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: TEXT_SECONDARY }} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Layers sx={{ fontSize: 16, color: "#a78bfa" }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                Compose Keys
              </Typography>
              <Chip label={COMPOSE_KEYS.length} size="small" sx={{ background: alpha("#a78bfa", 0.15), color: "#a78bfa", border: `1px solid ${alpha("#a78bfa", 0.3)}` }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 1, px: 1 }}>
            {COMPOSE_KEYS.map((item) => (
              <ComposeKeyCard key={item.name} item={item} />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Quick Commands Accordion */}
        <Accordion
          expanded={expanded === "quick-commands"}
          onChange={handleChange("quick-commands")}
          sx={{ mb: 0.5 }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: TEXT_SECONDARY }} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Code sx={{ fontSize: 16, color: "#34d399" }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                Quick Commands
              </Typography>
              <Chip label={QUICK_COMMANDS.length} size="small" sx={{ background: alpha("#34d399", 0.12), color: "#34d399", border: `1px solid ${alpha("#34d399", 0.3)}` }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 1, px: 1 }}>
            {QUICK_COMMANDS.map((item) => (
              <Box key={item.cmd} sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: "0.7rem" }}>
                  {item.desc}
                </Typography>
                <CodeSnippet code={item.cmd} />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Best Practices Accordion */}
        <Accordion
          expanded={expanded === "best-practices"}
          onChange={handleChange("best-practices")}
          sx={{ mb: 0.5 }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: TEXT_SECONDARY }} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Security sx={{ fontSize: 16, color: "#fbbf24" }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                Best Practices
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 1, px: 1 }}>
            {[
              { tip: "Use multi-stage builds", detail: "Separate build and runtime stages to keep the final image lean. Only copy the built artifacts to the runner stage." },
              { tip: "Run as non-root user", detail: "Create and switch to a non-root user with USER instruction to reduce attack surface." },
              { tip: "Use .dockerignore", detail: "Exclude node_modules, .git, logs, and other unnecessary files to speed up builds and reduce image size." },
              { tip: "Minimize layers", detail: "Chain RUN commands with && to reduce the number of layers. More layers = larger image." },
              { tip: "Use specific base image tags", detail: "Avoid latest tag. Use specific version tags like node:20-alpine to ensure reproducibility." },
              { tip: "Copy package files first", detail: "COPY package*.json ./ then RUN npm ci before copying source — this leverages Docker's layer cache for faster builds." },
              { tip: "Prefer alpine images", detail: "Alpine-based images are 5-10x smaller than debian-based ones. Use -alpine variants when available." },
              { tip: "Set HEALTHCHECK", detail: "Add a HEALTHCHECK so Docker can restart unhealthy containers automatically." },
            ].map(({ tip, detail }) => (
              <Box key={tip} sx={{ borderLeft: `3px solid #fbbf24`, pl: 1.5, py: 0.5, mb: 1.5, background: alpha("#fbbf24", 0.04), borderRadius: "0 4px 4px 0" }}>
                <Typography variant="caption" sx={{ color: "#fbbf24", fontWeight: 600, display: "block", fontSize: "0.75rem", mb: 0.25 }}>
                  ✓ {tip}
                </Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block", fontSize: "0.7rem" }}>
                  {detail}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Multi-Stage Builds Accordion */}
        <Accordion
          expanded={expanded === "multi-stage"}
          onChange={handleChange("multi-stage")}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: TEXT_SECONDARY }} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountTree sx={{ fontSize: 16, color: "#818cf8" }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                Multi-Stage Build Example
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 1, px: 1 }}>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block", mb: 1, fontSize: "0.7rem" }}>
              A typical Node.js multi-stage build with separate deps, builder, and runner stages:
            </Typography>
            <CodeSnippet code={`FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=deps /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]`} />
            <Box sx={{ mt: 1.5 }}>
              <Chip
                label="📖 Multi-stage builds guide"
                component="a"
                href="https://docs.docker.com/build/building/multi-stage/"
                target="_blank"
                rel="noopener noreferrer"
                clickable
                size="small"
                sx={{
                  fontSize: "0.68rem",
                  background: alpha("#818cf8", 0.1),
                  color: "#818cf8",
                  border: `1px solid ${alpha("#818cf8", 0.3)}`,
                  "&:hover": { background: alpha("#818cf8", 0.2) },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: `1px solid ${BORDER}`,
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: "0.65rem" }}>
          Official documentation at{" "}
          <Link href="https://docs.docker.com" target="_blank" rel="noopener noreferrer" sx={{ color: DOCKER_BLUE }}>
            docs.docker.com
          </Link>
        </Typography>
      </Box>
    </Drawer>
  );
}
