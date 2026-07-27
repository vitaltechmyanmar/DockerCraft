import { DockerfileConfig, FrameworkId } from "@/types/dockerfile";

// ─── Image → Framework mapping ───────────────────────────────────────────────

const IMAGE_TO_FRAMEWORK: Array<[RegExp, FrameworkId]> = [
  [/^node:/i,             "nodejs"],
  [/^oven\/bun/i,         "bun"],
  [/^python:/i,           "python-fastapi"],
  [/^golang:/i,           "go"],
  [/^rust:/i,             "rust"],
  [/^eclipse-temurin:/i,  "java-spring"],
  [/^php:/i,              "php-laravel"],
  [/^ruby:/i,             "ruby-rails"],
  [/^nginx:/i,            "nginx"],
];

function detectFramework(image: string): FrameworkId | null {
  for (const [pattern, id] of IMAGE_TO_FRAMEWORK) {
    if (pattern.test(image)) return id;
  }
  return null;
}

// ─── Tag → BaseImage + version ───────────────────────────────────────────────

function parseTag(tag: string): { version: string; baseImage: "alpine" | "slim" | "debian" | "ubuntu" | "scratch" } {
  if (tag === "latest" || tag === "") return { version: "latest", baseImage: "debian" };
  if (tag.includes("alpine")) {
    const ver = tag.replace(/-?alpine.*$/, "").trim();
    return { version: ver || "latest", baseImage: "alpine" };
  }
  if (tag.includes("slim")) {
    const ver = tag.replace(/-?slim.*$/, "").trim();
    return { version: ver || "latest", baseImage: "slim" };
  }
  // Everything else — just strip known suffixes
  const ver = tag.replace(/-?(jdk|jre|fpm|bookworm|bullseye|buster)[-\w]*$/, "").trim();
  return { version: ver || tag, baseImage: "debian" };
}

// ─── CMD / ENTRYPOINT parser ─────────────────────────────────────────────────

function parseCmd(raw: string): string {
  raw = raw.trim();
  // JSON form: ["node", "server.js"]
  if (raw.startsWith("[")) {
    try {
      const arr = JSON.parse(raw) as string[];
      return arr.join(" ");
    } catch {
      // fall through
    }
  }
  // Shell form
  return raw.replace(/^["']|["']$/g, "").trim();
}

// ─── ENV parser ──────────────────────────────────────────────────────────────

function parseEnv(raw: string): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = [];
  // Support both "KEY=value KEY2=value2" and "KEY value"
  const parts = raw.trim().split(/\s+/);
  for (const part of parts) {
    if (part.includes("=")) {
      const eqIdx = part.indexOf("=");
      const key = part.slice(0, eqIdx).trim();
      const value = part.slice(eqIdx + 1).replace(/^["']|["']$/g, "").trim();
      if (key && !key.startsWith("NODE_ENV") && !key.startsWith("PYTHONDONT")) {
        result.push({ key, value });
      }
    }
  }
  return result;
}

// ─── HEALTHCHECK parser ──────────────────────────────────────────────────────

function parseHealthcheck(raw: string): {
  healthCheck: boolean;
  healthCheckPath: string;
  healthCheckInterval: number;
} {
  const defaults = { healthCheck: true, healthCheckPath: "/health", healthCheckInterval: 30 };
  const intervalMatch = raw.match(/--interval=(\d+)/);
  if (intervalMatch) defaults.healthCheckInterval = parseInt(intervalMatch[1], 10);
  const pathMatch = raw.match(/localhost:\d+(\/[^\s|]+)/);
  if (pathMatch) defaults.healthCheckPath = pathMatch[1];
  return defaults;
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export interface ParseResult {
  config: Partial<DockerfileConfig>;
  warnings: string[];
}

/**
 * Parse a raw Dockerfile string into a partial `DockerfileConfig`.
 * Only the last `FROM` image (the final stage) is used for framework detection.
 */
export function parseDockerfile(content: string): ParseResult {
  const lines = content.split(/\r?\n/);
  const warnings: string[] = [];
  const partial: Partial<DockerfileConfig> = {
    envVars: [],
    multiStage: false,
    nonRootUser: false,
    healthCheck: false,
    healthCheckPath: "/health",
    healthCheckInterval: 30,
  };

  let fromCount = 0;
  let currentImage = "";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    // Multi-line continuation — join and re-process is complex, skip for now
    const upper = line.toUpperCase();

    if (upper.startsWith("FROM ")) {
      fromCount++;
      if (fromCount > 1) partial.multiStage = true;
      // FROM image:tag [AS stage]
      const parts = line.slice(5).split(/\s+/);
      currentImage = parts[0] ?? "";
      const [img, tag = "latest"] = currentImage.split(":");
      const framework = detectFramework(img + ":");
      if (framework) {
        partial.framework = framework;
        const { version, baseImage } = parseTag(tag);
        partial.version = version;
        partial.baseImage = baseImage;
      }
    } else if (upper.startsWith("WORKDIR ")) {
      partial.workdir = line.slice(8).trim();
    } else if (upper.startsWith("EXPOSE ")) {
      const port = parseInt(line.slice(7).trim(), 10);
      if (!isNaN(port)) partial.port = port;
    } else if (upper.startsWith("ENV ")) {
      const envs = parseEnv(line.slice(4));
      if (envs.length > 0) {
        partial.envVars = [...(partial.envVars ?? []), ...envs];
      }
    } else if (upper.startsWith("CMD ") || upper.startsWith("CMD[")) {
      partial.startCommand = parseCmd(line.slice(3).trim());
    } else if (upper.startsWith("ENTRYPOINT ") || upper.startsWith("ENTRYPOINT[")) {
      const ep = parseCmd(line.slice(11).trim());
      if (!partial.startCommand) partial.startCommand = ep;
    } else if (upper.startsWith("HEALTHCHECK ")) {
      const hc = parseHealthcheck(line.slice(12));
      Object.assign(partial, hc);
    } else if (upper.startsWith("USER ")) {
      partial.nonRootUser = true;
    }
  }

  if (!partial.framework) {
    warnings.push(`Could not detect framework from image "${currentImage}". Defaulting to nodejs.`);
    partial.framework = "nodejs";
  }

  return { config: partial, warnings };
}
