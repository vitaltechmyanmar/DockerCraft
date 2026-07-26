import { DockerfileConfig, FrameworkId } from "@/types/dockerfile";

function envVarsBlock(config: DockerfileConfig): string {
  if (config.envVars.length === 0) return "";
  const lines = config.envVars.map(({ key, value }) => `ENV ${key}="${value}"`);
  return "\n" + lines.join("\n");
}

function healthCheckBlock(config: DockerfileConfig): string {
  if (!config.healthCheck) return "";
  return `\nHEALTHCHECK --interval=${config.healthCheckInterval}s --timeout=5s --start-period=10s --retries=3 \\\n  CMD wget -qO- http://localhost:${config.port}${config.healthCheckPath} || exit 1`;
}

// ─── Framework-specific generators ─────────────────────────────────────────────

function generateNodejs(config: DockerfileConfig): string {
  const baseTag = config.baseImage === "alpine"
    ? `${config.version}-alpine`
    : config.baseImage === "slim"
    ? `${config.version}-slim`
    : config.version;

  if (config.multiStage) {
    return `# ─── Stage 1: Dependencies ────────────────────────────────────────
FROM node:${baseTag} AS deps
WORKDIR ${config.workdir}
COPY package*.json ./
RUN npm ci

# ─── Stage 2: Builder ─────────────────────────────────────────────
FROM node:${baseTag} AS builder
WORKDIR ${config.workdir}
COPY --from=deps ${config.workdir}/node_modules ./node_modules
COPY . .
RUN ${config.buildCommand}

# ─── Stage 3: Runner ──────────────────────────────────────────────
FROM node:${baseTag} AS runner
WORKDIR ${config.workdir}
ENV NODE_ENV=production${envVarsBlock(config)}
${config.nonRootUser ? `RUN addgroup --system --gid 1001 appgroup && \\
    adduser --system --uid 1001 --ingroup appgroup appuser\n` : ""}
COPY --from=builder ${config.workdir}/node_modules ./node_modules
COPY --from=builder ${config.workdir} .
${config.nonRootUser ? "\nUSER appuser\n" : ""}
EXPOSE ${config.port}
CMD ["${config.startCommand.replace(/"/g, '\\"')}"]${healthCheckBlock(config)}`;
  }

  return `FROM node:${baseTag}
WORKDIR ${config.workdir}
ENV NODE_ENV=production${envVarsBlock(config)}

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE ${config.port}
CMD ["${config.startCommand.replace(/"/g, '\\"')}"]${healthCheckBlock(config)}`;
}

function generateNextjs(config: DockerfileConfig): string {
  const baseTag = config.baseImage === "alpine"
    ? `${config.version}-alpine`
    : `${config.version}-slim`;

  return `# ─── Stage 1: Dependencies ────────────────────────────────────────
FROM node:${baseTag} AS deps
RUN apk add --no-cache libc6-compat 2>/dev/null || true
WORKDIR ${config.workdir}
COPY package*.json ./
RUN npm ci

# ─── Stage 2: Builder ─────────────────────────────────────────────
FROM node:${baseTag} AS builder
WORKDIR ${config.workdir}
COPY --from=deps ${config.workdir}/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 3: Runner ──────────────────────────────────────────────
FROM node:${baseTag} AS runner
WORKDIR ${config.workdir}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1${envVarsBlock(config)}
${config.nonRootUser ? `RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs\n` : ""}
COPY --from=builder ${config.workdir}/public ./public
COPY --from=builder --chown=${config.nonRootUser ? "nextjs:nodejs" : "root:root"} ${config.workdir}/.next/standalone ./
COPY --from=builder --chown=${config.nonRootUser ? "nextjs:nodejs" : "root:root"} ${config.workdir}/.next/static ./.next/static
${config.nonRootUser ? "\nUSER nextjs\n" : ""}
EXPOSE ${config.port}
ENV PORT=${config.port}
CMD ["node", "server.js"]${healthCheckBlock(config)}`;
}

function generateReactVite(config: DockerfileConfig): string {
  return `# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM node:${config.version}-alpine AS builder
WORKDIR ${config.workdir}${envVarsBlock(config)}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Nginx Server ────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder ${config.workdir}/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE ${config.port}
CMD ["nginx", "-g", "daemon off;"]${healthCheckBlock(config)}`;
}

function generateBun(config: DockerfileConfig): string {
  return `FROM oven/bun:${config.version} AS base
WORKDIR ${config.workdir}

FROM base AS deps
COPY package*.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
WORKDIR ${config.workdir}
ENV NODE_ENV=production${envVarsBlock(config)}
${config.nonRootUser ? `RUN addgroup --system --gid 1001 appgroup && \\
    adduser --system --uid 1001 --ingroup appgroup appuser\nUSER appuser\n` : ""}
COPY --from=deps ${config.workdir}/node_modules ./node_modules
COPY . .

EXPOSE ${config.port}
CMD ["bun", "run", "start"]${healthCheckBlock(config)}`;
}

function generatePython(config: DockerfileConfig): string {
  const baseTag = config.baseImage === "alpine"
    ? `${config.version}-alpine`
    : config.baseImage === "slim"
    ? `${config.version}-slim`
    : config.version;

  return `FROM python:${baseTag}
WORKDIR ${config.workdir}

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1${envVarsBlock(config)}
${config.nonRootUser ? `RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser\n` : ""}
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

COPY ${config.nonRootUser ? `--chown=appuser:appgroup ` : ""}. .
${config.nonRootUser ? "\nUSER appuser\n" : ""}
EXPOSE ${config.port}
CMD ${JSON.stringify(config.startCommand.split(" "))}${healthCheckBlock(config)}`;
}

function generateGo(config: DockerfileConfig): string {
  if (config.multiStage) {
    return `# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM golang:${config.version}-alpine AS builder
WORKDIR ${config.workdir}

RUN apk add --no-cache git ca-certificates
${envVarsBlock(config)}

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-w -s" -o main .

# ─── Stage 2: Runner (scratch for minimal image) ──────────────────
FROM scratch AS runner
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder ${config.workdir}/main .

EXPOSE ${config.port}
ENTRYPOINT ["/main"]${healthCheckBlock(config)}`;
  }

  return `FROM golang:${config.version}-alpine
WORKDIR ${config.workdir}${envVarsBlock(config)}

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

EXPOSE ${config.port}
CMD ["./main"]${healthCheckBlock(config)}`;
}

function generateJavaSpring(config: DockerfileConfig): string {
  return `# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM eclipse-temurin:${config.version}-jdk-alpine AS builder
WORKDIR ${config.workdir}

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw package -DskipTests

# ─── Stage 2: Runner ──────────────────────────────────────────────
FROM eclipse-temurin:${config.version}-jre-alpine AS runner
WORKDIR ${config.workdir}
${envVarsBlock(config)}
${config.nonRootUser ? `RUN addgroup --system --gid 1001 spring && \\
    adduser --system --uid 1001 --ingroup spring spring\nUSER spring\n` : ""}
COPY --from=builder ${config.workdir}/target/*.jar app.jar

EXPOSE ${config.port}
ENTRYPOINT ["java", "-jar", "/app/app.jar"]${healthCheckBlock(config)}`;
}

function generatePhpLaravel(config: DockerfileConfig): string {
  return `FROM php:${config.version}-fpm-alpine
WORKDIR ${config.workdir}
${envVarsBlock(config)}

RUN apk add --no-cache \\
    git \\
    curl \\
    libpng-dev \\
    libxml2-dev \\
    zip \\
    unzip && \\
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer*.json ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize && \\
    php artisan config:cache && \\
    php artisan route:cache
${config.nonRootUser ? `\nRUN chown -R www-data:www-data storage bootstrap/cache\nUSER www-data\n` : ""}
EXPOSE ${config.port}
CMD ["php-fpm"]${healthCheckBlock(config)}`;
}

function generateRust(config: DockerfileConfig): string {
  if (config.multiStage) {
    return `# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM rust:${config.version} AS builder
WORKDIR ${config.workdir}

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -f target/release/deps/app*

COPY . .
RUN cargo build --release

# ─── Stage 2: Runner (minimal debian) ─────────────────────────────
FROM debian:bookworm-slim AS runner
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
${config.nonRootUser ? `RUN useradd --create-home --shell /bin/bash appuser\nUSER appuser\n` : ""}
COPY --from=builder ${config.workdir}/target/release/app /usr/local/bin/app

EXPOSE ${config.port}
CMD ["/usr/local/bin/app"]${healthCheckBlock(config)}`;
  }

  return `FROM rust:${config.version}
WORKDIR ${config.workdir}${envVarsBlock(config)}

COPY Cargo.toml Cargo.lock ./
COPY src src

RUN cargo build --release

EXPOSE ${config.port}
CMD ["./target/release/app"]${healthCheckBlock(config)}`;
}

function generateRubyRails(config: DockerfileConfig): string {
  return `FROM ruby:${config.version}-alpine
WORKDIR ${config.workdir}

RUN apk add --no-cache \\
    build-base \\
    postgresql-dev \\
    nodejs \\
    yarn \\
    tzdata
${envVarsBlock(config)}

COPY Gemfile Gemfile.lock ./
RUN bundle install --deployment --without development test

COPY . .
RUN bundle exec rails assets:precompile
${config.nonRootUser ? `\nRUN adduser -D -g '' appuser\nUSER appuser\n` : ""}
EXPOSE ${config.port}
CMD ["rails", "server", "-b", "0.0.0.0"]${healthCheckBlock(config)}`;
}

function generateNginx(config: DockerfileConfig): string {
  return `FROM nginx:${config.version}
${envVarsBlock(config)}

# Copy your site files
COPY ./dist /usr/share/nginx/html

# Optional: copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE ${config.port}
CMD ["nginx", "-g", "daemon off;"]${healthCheckBlock(config)}`;
}

function generateStatic(config: DockerfileConfig): string {
  return `FROM nginx:${config.version}
${envVarsBlock(config)}

# Copy static files
COPY . /usr/share/nginx/html

EXPOSE ${config.port}
CMD ["nginx", "-g", "daemon off;"]${healthCheckBlock(config)}`;
}

// ─── Main Generator ─────────────────────────────────────────────────────────

export function generateDockerfile(config: DockerfileConfig): string {
  const generators: Record<FrameworkId, (c: DockerfileConfig) => string> = {
    nodejs: generateNodejs,
    nextjs: generateNextjs,
    "react-vite": generateReactVite,
    bun: generateBun,
    "python-fastapi": generatePython,
    "python-django": generatePython,
    "python-flask": generatePython,
    go: generateGo,
    "java-spring": generateJavaSpring,
    "php-laravel": generatePhpLaravel,
    rust: generateRust,
    "ruby-rails": generateRubyRails,
    nginx: generateNginx,
    static: generateStatic,
  };

  const generator = generators[config.framework];
  if (!generator) return "# Framework not supported";

  return generator(config);
}

export function generateDockerignore(config: DockerfileConfig): string {
  const common = [
    "# Version control",
    ".git",
    ".gitignore",
    "",
    "# Docker",
    "Dockerfile",
    "docker-compose*.yml",
    ".dockerignore",
    "",
    "# Environment files",
    ".env",
    ".env.*",
    "!.env.example",
    "",
    "# IDE / OS",
    ".vscode",
    ".idea",
    "*.swp",
    ".DS_Store",
    "Thumbs.db",
    "",
    "# Logs",
    "*.log",
    "logs/",
    "npm-debug.log*",
    "",
  ];

  const jsSpecific = [
    "# Node.js",
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    ".turbo/",
    "coverage/",
    ".nyc_output/",
  ];

  const pythonSpecific = [
    "# Python",
    "__pycache__/",
    "*.pyc",
    "*.pyo",
    "*.pyd",
    ".Python",
    "env/",
    "venv/",
    ".venv/",
    "*.egg-info/",
    "dist/",
    "build/",
  ];

  const goSpecific = [
    "# Go",
    "vendor/",
    "*.test",
  ];

  const rustSpecific = [
    "# Rust",
    "target/",
  ];

  const javaSpecific = [
    "# Java / Maven",
    "target/",
    "*.class",
    "*.jar",
    "!app.jar",
  ];

  let frameworkSpecific: string[] = [];
  if (["nodejs", "nextjs", "react-vite", "bun"].includes(config.framework)) {
    frameworkSpecific = jsSpecific;
  } else if (config.framework.startsWith("python")) {
    frameworkSpecific = pythonSpecific;
  } else if (config.framework === "go") {
    frameworkSpecific = goSpecific;
  } else if (config.framework === "rust") {
    frameworkSpecific = rustSpecific;
  } else if (config.framework === "java-spring") {
    frameworkSpecific = javaSpecific;
  }

  return [...common, ...frameworkSpecific].join("\n");
}
