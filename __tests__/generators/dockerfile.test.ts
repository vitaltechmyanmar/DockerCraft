import { generateDockerfile, generateDockerignore } from "@/lib/generators/dockerfile";
import { DockerfileConfig } from "@/types/dockerfile";

const baseConfig: DockerfileConfig = {
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

// ─── Node.js ──────────────────────────────────────────────────────────────────

describe("generateDockerfile — Node.js", () => {
  it("multi-stage alpine: contains deps, builder, runner stages", () => {
    const out = generateDockerfile(baseConfig);
    expect(out).toContain("FROM node:20-alpine AS deps");
    expect(out).toContain("FROM node:20-alpine AS builder");
    expect(out).toContain("FROM node:20-alpine AS runner");
  });

  it("single-stage: no AS keyword", () => {
    const out = generateDockerfile({ ...baseConfig, multiStage: false });
    expect(out).not.toContain(" AS ");
    expect(out).toContain("FROM node:20-alpine");
  });

  it("exposes correct port", () => {
    const out = generateDockerfile({ ...baseConfig, port: 8080 });
    expect(out).toContain("EXPOSE 8080");
  });

  it("includes non-root user setup", () => {
    const out = generateDockerfile(baseConfig);
    expect(out).toContain("addgroup");
    expect(out).toContain("appuser");
    expect(out).toContain("USER appuser");
  });

  it("skips non-root user when disabled", () => {
    const out = generateDockerfile({ ...baseConfig, nonRootUser: false });
    expect(out).not.toContain("USER appuser");
  });

  it("includes env vars when provided", () => {
    const out = generateDockerfile({
      ...baseConfig,
      envVars: [{ key: "DATABASE_URL", value: "postgres://localhost/db" }],
    });
    expect(out).toContain('ENV DATABASE_URL="postgres://localhost/db"');
  });

  it("includes healthcheck when enabled", () => {
    const out = generateDockerfile({
      ...baseConfig,
      healthCheck: true,
      healthCheckPath: "/health",
      healthCheckInterval: 30,
    });
    expect(out).toContain("HEALTHCHECK");
    expect(out).toContain("/health");
  });
});

// ─── Next.js ──────────────────────────────────────────────────────────────────

describe("generateDockerfile — Next.js", () => {
  const cfg: DockerfileConfig = { ...baseConfig, framework: "nextjs" };

  it("contains standalone output copy", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain(".next/standalone");
    expect(out).toContain(".next/static");
  });

  it("disables telemetry", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain("NEXT_TELEMETRY_DISABLED=1");
  });
});

// ─── React Vite ───────────────────────────────────────────────────────────────

describe("generateDockerfile — React Vite", () => {
  it("uses nginx runner stage", () => {
    const out = generateDockerfile({ ...baseConfig, framework: "react-vite" });
    expect(out).toContain("FROM nginx:alpine AS runner");
    expect(out).toContain("/usr/share/nginx/html");
  });
});

// ─── Go ───────────────────────────────────────────────────────────────────────

describe("generateDockerfile — Go", () => {
  const cfg: DockerfileConfig = { ...baseConfig, framework: "go", version: "1.22" };

  it("multi-stage uses scratch runner", () => {
    const out = generateDockerfile({ ...cfg, multiStage: true });
    expect(out).toContain("FROM scratch AS runner");
    expect(out).toContain("CGO_ENABLED=0");
  });

  it("single-stage uses golang base image", () => {
    const out = generateDockerfile({ ...cfg, multiStage: false });
    expect(out).toContain("FROM golang:1.22-alpine");
  });
});

// ─── Rust ─────────────────────────────────────────────────────────────────────

describe("generateDockerfile — Rust", () => {
  const cfg: DockerfileConfig = { ...baseConfig, framework: "rust", version: "1.79" };

  it("multi-stage uses debian slim runner", () => {
    const out = generateDockerfile({ ...cfg, multiStage: true });
    expect(out).toContain("FROM debian:bookworm-slim AS runner");
    expect(out).toContain("cargo build --release");
  });
});

// ─── Java Spring ──────────────────────────────────────────────────────────────

describe("generateDockerfile — Java Spring Boot", () => {
  const cfg: DockerfileConfig = { ...baseConfig, framework: "java-spring", version: "21" };

  it("uses eclipse-temurin JDK for builder and JRE for runner", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain("eclipse-temurin:21-jdk-alpine AS builder");
    expect(out).toContain("eclipse-temurin:21-jre-alpine AS runner");
  });

  it("copies jar file", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain("app.jar");
  });
});

// ─── Python ───────────────────────────────────────────────────────────────────

describe("generateDockerfile — Python (FastAPI/Django/Flask)", () => {
  const cfg: DockerfileConfig = {
    ...baseConfig,
    framework: "python-fastapi",
    version: "3.12",
    port: 8000,
  };

  it("sets PYTHONDONTWRITEBYTECODE and PYTHONUNBUFFERED", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain("PYTHONDONTWRITEBYTECODE=1");
    expect(out).toContain("PYTHONUNBUFFERED=1");
  });

  it("exposes port 8000", () => {
    const out = generateDockerfile(cfg);
    expect(out).toContain("EXPOSE 8000");
  });
});

// ─── .dockerignore ────────────────────────────────────────────────────────────

describe("generateDockerignore", () => {
  it("always includes common entries", () => {
    const out = generateDockerignore(baseConfig);
    expect(out).toContain(".git");
    expect(out).toContain(".env");
    expect(out).toContain("Dockerfile");
  });

  it("includes node_modules for JS frameworks", () => {
    const out = generateDockerignore(baseConfig);
    expect(out).toContain("node_modules/");
  });

  it("includes __pycache__ for Python frameworks", () => {
    const out = generateDockerignore({ ...baseConfig, framework: "python-fastapi" });
    expect(out).toContain("__pycache__/");
    expect(out).not.toContain("node_modules/");
  });

  it("includes target/ for Rust", () => {
    const out = generateDockerignore({ ...baseConfig, framework: "rust" });
    expect(out).toContain("target/");
  });
});
