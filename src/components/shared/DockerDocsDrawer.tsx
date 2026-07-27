"use client";

import { ChevronDown, X, ExternalLink, Code, FileText, Lock, Layers } from "lucide-react";
import { useState } from "react";

interface DockerDocsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DOCKER_BLUE = "#0db7ed";

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
    <pre className="mt-2 rounded border border-gray-700 bg-black p-3 text-sm font-mono text-blue-400 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
      {code}
    </pre>
  );
}

function DirectiveCard({ item }: { item: typeof DOCKERFILE_DIRECTIVES[0] }) {
  return (
    <div
      className="mb-4 border-l-4 pl-4 py-2 rounded-r"
      style={{
        borderColor: item.color,
        backgroundColor: item.color + "0a",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-xs font-mono font-bold"
          style={{ color: item.color }}
        >
          {item.name}
        </span>
        <a
          href={item.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center ml-auto text-gray-500 hover:text-blue-400 transition"
          title="View official docs"
        >
          <ExternalLink size={12} />
        </a>
      </div>
      <p className="text-xs text-gray-400 mb-2 block">{item.description}</p>
      <CodeSnippet code={item.example} />
    </div>
  );
}

function ComposeKeyCard({ item }: { item: typeof COMPOSE_KEYS[0] }) {
  return (
    <div
      className="mb-4 border-l-4 pl-4 py-2 rounded-r"
      style={{
        borderColor: item.color,
        backgroundColor: item.color + "0a",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-xs font-mono font-bold"
          style={{ color: item.color }}
        >
          {item.name}
        </span>
        <a
          href={item.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center ml-auto text-gray-500 hover:text-blue-400 transition"
          title="View official docs"
        >
          <ExternalLink size={12} />
        </a>
      </div>
      <p className="text-xs text-gray-400 mb-2 block">{item.description}</p>
      <CodeSnippet code={item.example} />
    </div>
  );
}

function AccordionItem({
  title,
  icon,
  badge,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-700 rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 bg-gray-900 hover:bg-gray-800 transition flex items-center gap-2 text-left"
      >
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex-shrink-0">{icon}</span>
          <span className="text-sm font-semibold text-gray-200">{title}</span>
          {badge !== undefined && (
            <span className="ml-auto flex-shrink-0 px-2 py-0.5 bg-gray-700 text-xs text-gray-300 rounded">
              {badge}
            </span>
          )}
        </div>
      </button>
      {expanded && <div className="p-3 border-t border-gray-700 bg-gray-950">{children}</div>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export function DockerDocsDrawer({ open, onClose }: DockerDocsDrawerProps) {
  const [expanded, setExpanded] = useState<string | false>("dockerfile-directives");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-96 max-w-full bg-gray-950 border-l border-gray-700 flex flex-col max-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-700 bg-gray-900 p-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded flex items-center justify-center bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-base flex-shrink-0">
            🐳
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-100 leading-tight">
              Docker Reference
            </h2>
            <p className="text-xs text-gray-400">
              Directives · Compose keys · Commands
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-200 transition flex-shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-3 space-y-3">
          {/* External Links */}
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Official Docs
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {EXTERNAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-800 border border-gray-700 text-gray-400 rounded hover:bg-blue-500 hover:bg-opacity-10 hover:text-blue-400 hover:border-blue-500 hover:border-opacity-40 transition"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <hr className="border-gray-700" />

          {/* Dockerfile Directives Accordion */}
          <AccordionItem
            title="Dockerfile Directives"
            icon={<FileText size={16} className="text-blue-400" />}
            badge={DOCKERFILE_DIRECTIVES.length}
            expanded={expanded === "dockerfile-directives"}
            onToggle={() => setExpanded(expanded === "dockerfile-directives" ? false : "dockerfile-directives")}
          >
            <div className="space-y-3">
              {DOCKERFILE_DIRECTIVES.map((item) => (
                <DirectiveCard key={item.name} item={item} />
              ))}
            </div>
          </AccordionItem>

          {/* Compose Keys Accordion */}
          <AccordionItem
            title="Compose Keys"
            icon={<Layers size={16} style={{ color: "#a78bfa" }} />}
            badge={COMPOSE_KEYS.length}
            expanded={expanded === "compose-keys"}
            onToggle={() => setExpanded(expanded === "compose-keys" ? false : "compose-keys")}
          >
            <div className="space-y-3">
              {COMPOSE_KEYS.map((item) => (
                <ComposeKeyCard key={item.name} item={item} />
              ))}
            </div>
          </AccordionItem>

          {/* Quick Commands Accordion */}
          <AccordionItem
            title="Quick Commands"
            icon={<Code size={16} style={{ color: "#34d399" }} />}
            badge={QUICK_COMMANDS.length}
            expanded={expanded === "quick-commands"}
            onToggle={() => setExpanded(expanded === "quick-commands" ? false : "quick-commands")}
          >
            <div className="space-y-3">
              {QUICK_COMMANDS.map((item) => (
                <div key={item.cmd}>
                  <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
                  <CodeSnippet code={item.cmd} />
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Best Practices Accordion */}
          <AccordionItem
            title="Best Practices"
            icon={<Lock size={16} style={{ color: "#fbbf24" }} />}
            expanded={expanded === "best-practices"}
            onToggle={() => setExpanded(expanded === "best-practices" ? false : "best-practices")}
          >
            <div className="space-y-3">
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
                <div
                  key={tip}
                  className="border-l-4 pl-4 py-2 rounded-r"
                  style={{
                    borderColor: "#fbbf24",
                    backgroundColor: "#fbbf2408",
                  }}
                >
                  <p className="text-xs font-semibold text-yellow-400 mb-1">✓ {tip}</p>
                  <p className="text-xs text-gray-400">{detail}</p>
                </div>
              ))}
            </div>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
