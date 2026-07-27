# DockerCraft — Implementation Plan

> **Purpose**: This document records the technical design, architectural decisions, and future roadmap for the DockerCraft project. It serves as a living reference for contributors, maintainers, and future deployment pipelines.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Phase 1: Foundation (Completed)](#phase-1-foundation-completed)
- [Phase 2: Current State (v1.0.0)](#phase-2-current-state-v100)
- [Phase 3: Planned Enhancements](#phase-3-planned-enhancements)
- [Deployment Strategy](#deployment-strategy)
- [Architecture Decisions (ADR)](#architecture-decisions-adr)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Targets](#performance-targets)
- [Accessibility Targets](#accessibility-targets)
- [Testing Strategy](#testing-strategy)

---

## Project Overview

**DockerCraft** is a browser-based tool that generates production-grade `Dockerfile` and `docker-compose.yml` configurations through an interactive visual form with live output preview.

| Property | Value |
|---|---|
| **Repository** | `vitaltechmyanmar/DockerCraft` |
| **Framework** | Next.js 14 (App Router, client-side only) |
| **Version** | v1.0.0 |
| **License** | MIT |
| **Target Users** | Backend developers, DevOps engineers, full-stack teams |

---

## Phase 1: Foundation (Completed)

Initial scaffolding and core feature implementation.

### ✅ Completed Tasks

- [x] Initialize Next.js 14 project with TypeScript, Tailwind CSS
- [x] Define `DockerfileConfig` and `ComposeConfig` TypeScript types
- [x] Build `FrameworkSelector` component with categorized grid layout
- [x] Implement `DockerfileForm` with all configuration options:
  - Framework selection
  - Base image variant (alpine, slim, full)
  - Node.js / language version picker
  - Working directory
  - Port exposure
  - Environment variables (key-value pairs)
  - Build command
  - Start command
  - Multi-stage build toggle
  - Non-root user toggle
  - Health check toggle (configurable path + interval)
- [x] Implement generator functions for 14 frameworks in `lib/generators/dockerfile.ts`
- [x] Implement `DockerfilePreview` with syntax highlighting, copy, and download actions
- [x] Generate framework-specific `.dockerignore` content
- [x] Build `ComposeForm` with:
  - Project name field
  - Docker Compose version selector
  - Network management (add/remove named networks)
  - Volume management (add/remove named volumes)
  - Add/remove services dynamically
- [x] Build `ServiceCard` with:
  - Service name, image, preset selector
  - Port mapping (host:container pairs)
  - Environment variable pairs
  - Volume mounts
  - `depends_on` relationship picker
  - Restart policy
  - Named network assignment
  - Optional Dockerfile build integration
- [x] Implement `ComposePreview` with YAML output, copy, and download
- [x] Add service presets: `postgres`, `mysql`, `mongodb`, `redis`, `nginx`, `rabbitmq`, `elasticsearch`
- [x] Build responsive layout (split-panel on desktop, tab toggle on mobile)
- [x] Add glassmorphism dark UI with Spotlight effect and radial glow ambience
- [x] Add Framer Motion tab transitions and entrance animations
- [x] Implement live preview badge
- [x] Add SEO metadata in `layout.tsx`
- [x] Add stats hero section (14+ frameworks, 8 templates, etc.)
- [x] Header with GitHub link and Live Preview badge

---

## Phase 2: Current State (v1.0.0)

### Supported Frameworks (14)

| ID | Label | Category | Multi-Stage |
|---|---|---|---|
| `nodejs` | Node.js | JavaScript | ✅ |
| `nextjs` | Next.js | JavaScript | ✅ |
| `react-vite` | React (Vite) | JavaScript | ✅ + Nginx |
| `bun` | Bun | JavaScript | ✅ |
| `python-fastapi` | FastAPI | Python | ❌ |
| `python-django` | Django | Python | ❌ |
| `python-flask` | Flask | Python | ❌ |
| `go` | Go | Go | ✅ (scratch) |
| `java-spring` | Spring Boot | Java | ✅ |
| `php-laravel` | Laravel | PHP | ❌ |
| `rust` | Rust | Rust | ✅ |
| `ruby-rails` | Ruby on Rails | Ruby | ❌ |
| `nginx` | Nginx | Server | ❌ |
| `static` | Static Site | Server | ❌ |

### Service Presets (7)

`postgres` · `mysql` · `mongodb` · `redis` · `nginx` · `rabbitmq` · `elasticsearch`

---

## Phase 3: Planned Enhancements

These are ordered by priority. Each item includes implementation notes for contributors.

---

### 🔵 Priority 1 — Core Feature Completeness

#### 3.1 Add `.dockerignore` Download to Compose Tab

- **Status**: ✅ Completed (v1.1.0)
- **File**: `src/components/compose/ComposePreview.tsx`
- **Notes**: Added a tab switcher (`docker-compose.yml` / `.dockerignore`) identical to the Dockerfile Preview pattern. `generateComposeDockerignore()` added to `lib/generators/compose.ts`.

#### 3.2 Deno Framework Support

- **Status**: ✅ Completed (v1.1.0)
- **Files edited**:
  - `src/types/dockerfile.ts` — Added `"deno"` to `FrameworkId`
  - `src/lib/generators/templates.ts` — Added template entry (`denoland/deno:2`, port 8000)
  - `src/lib/generators/dockerfile.ts` — Added `generateDeno()` function and Deno `.dockerignore` entries

#### 3.3 Docker Compose v3 → v2 Migration Option

- **Status**: ✅ Completed (v1.1.0)
- **Notes**: Added `useV2Spec: boolean` to `ComposeConfig`. When enabled, the `version:` key is omitted from YAML output and the version select is visually disabled. Toggle added to `ComposeForm.tsx` Project Settings section.

#### 3.4 pnpm / yarn Support for Node.js Frameworks

- **Status**: ✅ Completed (v1.1.0)
- **Notes**: Added `packageManager?: JsPackageManager` (`"npm" | "pnpm" | "yarn" | "bun"`) to `DockerfileConfig`. A `pkgMgrCommands()` helper in `dockerfile.ts` maps each option to the correct lockfile `COPY`, `RUN install`, and `RUN build` lines. Package Manager `<select>` shown in `DockerfileForm.tsx` for nodejs, nextjs, and react-vite frameworks.

---

### 🟡 Priority 2 — UX Improvements

#### 3.5 Import from Existing Dockerfile

- **Status**: Not started
- **Notes**: Allow users to paste an existing `Dockerfile` and auto-parse it to populate the form. Requires a Dockerfile parser (tokenizer) utility in `lib/`.

#### 3.6 Share Configuration via URL

- **Status**: Not started
- **Notes**: Serialize the current `DockerfileConfig` or `ComposeConfig` to a base64-encoded query param so users can share links that restore state.
  ```
  /share?config=eyJmcmFtZXdvcmsiOiJub2RlanMiLCJ2ZXJzaW9uIjoiMjAifQ==
  ```
  Use `useSearchParams` in the Next.js App Router.

#### 3.7 Dark/Light Mode Toggle

- **Status**: Not started
- **Notes**: Currently hard-coded to dark mode. Add a toggle and a light color theme in `globals.css`.

#### 3.8 Keyboard Shortcuts

- **Status**: Not started
- **Notes**: Add `Ctrl+C` to copy, `Ctrl+D` to download, `Ctrl+1/2` to switch tabs.

---

### 🟢 Priority 3 — Templates & Content

#### 3.9 Quick-Start Templates

- **Status**: Not started
- **Notes**: Add a "Template Gallery" section on the homepage with common stacks (e.g., "Next.js + PostgreSQL + Redis") that pre-populates both Dockerfile and Compose tabs at once.

#### 3.10 Kubernetes YAML Export

- **Status**: Not started
- **Notes**: Add a third tab "Kubernetes" that generates `Deployment`, `Service`, and `ConfigMap` YAML from the Compose config.

#### 3.11 Helm Chart Export

- **Status**: Not started
- **Notes**: Convert Compose config into a basic Helm chart `values.yaml` + `templates/deployment.yaml`.

---

### 🔴 Priority 4 — Infrastructure & DX

#### 3.12 Unit Tests for Generators

- **Status**: Not started
- **Framework**: Jest + ts-jest
- **Notes**: Add unit tests for every generator function in `lib/generators/dockerfile.ts` and `lib/generators/compose.ts`. Each test verifies key output strings (e.g., `FROM node:20-alpine`, `WORKDIR /app`).

  ```bash
  npm install -D jest ts-jest @types/jest
  ```

#### 3.13 E2E Tests

- **Status**: Not started
- **Framework**: Playwright
- **Notes**: Test full user journeys:
  - Select framework → verify Dockerfile output contains expected content
  - Add Compose service → verify YAML output
  - Click copy → verify clipboard

#### 3.14 GitHub Actions CI

- **Status**: Not started
- **File**: `.github/workflows/ci.yml`

  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    lint-build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm
        - run: npm ci
        - run: npm run lint
        - run: npm run build
  ```

#### 3.15 Dependabot Configuration

- **Status**: Not started
- **File**: `.github/dependabot.yml`

  ```yaml
  version: 2
  updates:
    - package-ecosystem: npm
      directory: /
      schedule:
        interval: weekly
  ```

---

## Deployment Strategy

### Option A: Vercel (Primary — Recommended)

Vercel provides zero-config deployment for Next.js projects with automatic preview deployments for PRs.

```
main branch → Production deployment (https://dockercraft.vercel.app)
PR branch   → Preview deployment (https://dockercraft-<hash>.vercel.app)
```

**Steps**:
1. Connect GitHub repository to Vercel dashboard
2. Set **Framework Preset**: Next.js
3. No environment variables required
4. Enable automatic deployments on push to `main`

### Option B: Self-Hosted with Docker

Use the Dockerfile below to containerize DockerCraft itself:

```dockerfile
# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output requires these
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

> **Note**: Requires `output: 'standalone'` in `next.config.js` for the standalone build to work.

```js
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',  // ← Add this for Docker deployment
};
module.exports = nextConfig;
```

```bash
# Build and run
docker build -t dockercraft:latest .
docker run -d -p 3000:3000 --name dockercraft dockercraft:latest
```

### Option C: Docker Compose (with Nginx reverse proxy)

```yaml
# docker-compose.prod.yml
version: "3.9"
services:
  app:
    build: .
    container_name: dockercraft
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - web

  nginx:
    image: nginx:alpine
    container_name: dockercraft-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - web

networks:
  web:
    driver: bridge
```

### Option D: Static Export (Future)

> **Note**: DockerCraft uses `useState` (client components only) and has no server-side APIs. It _could_ be statically exported in the future if all dynamic routes are handled.

```js
// next.config.js
const nextConfig = {
  output: 'export',  // Generate static HTML/JS bundle
  trailingSlash: true,
};
```

This would allow hosting on GitHub Pages, Cloudflare Pages, or any static host.

---

## Architecture Decisions (ADR)

### ADR-001: Pure Client-Side Generation

**Decision**: All config-to-text generation happens in the browser, with no API routes.

**Rationale**:
- Eliminates latency between config change and preview update
- No server infrastructure needed — can be deployed as a static site
- Simplifies security model (no user data leaves the browser)

**Trade-offs**: Cannot support server-side caching or AI-assisted generation without a backend.

---

### ADR-002: Framework as Key in Discriminated Record

**Decision**: All generator functions are stored in a `Record<FrameworkId, GeneratorFn>` lookup map.

**Rationale**:
- O(1) dispatch — no if/else chains
- TypeScript enforces exhaustiveness (all `FrameworkId` values must have an entry)
- Easy to add new frameworks by adding one entry per location

---

### ADR-003: Radix UI for Form Primitives

**Decision**: Use Radix UI primitives for Select, Switch, Tabs, Slider, Tooltip instead of native HTML.

**Rationale**:
- Full WAI-ARIA compliance out of the box
- Unstyled by default — full control over appearance with Tailwind
- No additional JavaScript bloat beyond what's needed

---

### ADR-004: Framer Motion for Transitions

**Decision**: Use Framer Motion for tab transition animations.

**Rationale**:
- `AnimatePresence` handles unmount animations cleanly
- `layoutId` shared-element transitions for the active tab indicator
- Consistent spring physics for a premium feel

---

### ADR-005: Single-Page App, No Routes

**Decision**: All functionality lives in `src/app/page.tsx` with no additional routes.

**Rationale**:
- The tool is simple enough that sub-routes (e.g., `/dockerfile`, `/compose`) would add navigation complexity without benefit
- Tabs handle the two modes within a single page
- Deep-linking to a specific tab can be achieved via URL hash or query params in the future (Phase 3.6)

---

## CI/CD Pipeline

### Target Pipeline (to be implemented in Phase 3)

```
Push to feature branch
        │
        ▼
  ┌─────────────┐
  │  GitHub CI  │
  │  ─────────  │
  │  npm ci     │
  │  npm lint   │
  │  npm build  │
  │  npm test   │
  └─────┬───────┘
        │ ✅ Pass
        ▼
  Vercel Preview
  Deployment URL
        │
        ▼
  PR Review + Approval
        │
        ▼
  Merge to main
        │
        ▼
  Vercel Production
  Deployment
```

---

## Performance Targets

| Metric | Target | Notes |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Static assets, no API calls |
| **FID** / **INP** | < 100ms | React state updates are synchronous |
| **CLS** | < 0.1 | Fixed layout panels |
| **Bundle Size (JS)** | < 300kB gzip | Tree-shake Radix/Framer imports |
| **Lighthouse Score** | ≥ 90 | Performance + Accessibility |

---

## Accessibility Targets

- All interactive elements must have keyboard focus indicators
- `aria-label` on icon-only buttons (GitHub link, copy, download)
- Color contrast ≥ 4.5:1 for all text
- Framer Motion animations must respect `prefers-reduced-motion`
- All form fields must have associated labels

---

## Testing Strategy

### Unit Tests (Jest)

Test pure generator functions in isolation:

```typescript
// __tests__/generators/dockerfile.test.ts
import { generateDockerfile } from "@/lib/generators/dockerfile";

describe("generateDockerfile — Node.js", () => {
  it("generates multi-stage alpine Dockerfile", () => {
    const output = generateDockerfile({
      framework: "nodejs",
      version: "20",
      baseImage: "alpine",
      multiStage: true,
      // ...
    });
    expect(output).toContain("FROM node:20-alpine AS deps");
    expect(output).toContain("FROM node:20-alpine AS runner");
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/dockerfile.spec.ts
test("Select Python FastAPI and verify port 8000", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-testid="framework-python-fastapi"]');
  const preview = await page.locator('[data-testid="dockerfile-output"]').textContent();
  expect(preview).toContain("EXPOSE 8000");
});
```

---

## Version History

| Version | Date | Changes |
|---|---|---|
| `v1.1.0` | 2026-07 | Phase 3 Priority 1: Deno support, Compose `.dockerignore` tab, Compose v2 spec toggle, pnpm/yarn/bun package manager selector |
| `v1.0.0` | 2026-07 | Initial release: 14 frameworks, 7 service presets, Dockerfile + Compose generators |

---

> _This document should be updated whenever a significant architectural change, new feature, or deployment strategy is adopted. Keep it as the single source of truth for technical decisions._
