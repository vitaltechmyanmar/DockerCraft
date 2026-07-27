<div align="center">

<img src="https://img.shields.io/badge/DockerCraft-v1.3.0-0db7ed?style=for-the-badge&logo=docker&logoColor=white" alt="DockerCraft" />

# 🐳 DockerCraft

### _Generate Production-Ready Docker Configurations Instantly_

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-v5-007FFF?style=flat-square&logo=mui)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[🚀 Live Demo](https://github.com/vitaltechmyanmar/DockerCraft) · [📖 Docs](#-project-structure) · [🐛 Issues](https://github.com/vitaltechmyanmar/DockerCraft/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Docker Docs Panel](#-docker-docs-panel)
- [Supported Frameworks](#-supported-frameworks)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Changelog](#-changelog)
- [License](#-license)

---

## 🌟 Overview

**DockerCraft** is a modern, open-source web application that helps developers generate production-ready `Dockerfile` and `docker-compose.yml` files with a visual, interactive interface. No more copy-pasting from StackOverflow or memorizing Docker best practices — DockerCraft handles it all with sensible defaults and real-time preview.

> **"Configure your stack, preview instantly, copy or download. Best-practice defaults included."**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎛️ **Dockerfile Generator** | Generate optimized Dockerfiles for **15 frameworks** with multi-stage builds |
| 🧩 **Compose Generator** | Build multi-service `docker-compose.yml` with 7 service presets (PostgreSQL, Redis, etc.) |
| ⚡ **Live Preview** | Real-time output updates as you configure your settings |
| 📋 **Copy to Clipboard** | One-click copy of generated output |
| 📥 **Download Files** | Download `Dockerfile`, `.dockerignore`, and `docker-compose.yml` directly |
| 🛡️ **Security Best Practices** | Non-root user, minimal base images, `.dockerignore` for both Dockerfile and Compose tabs |
| 🏗️ **Multi-Stage Builds** | Optimized multi-stage builds for smaller production images |
| 🏥 **Health Checks** | Optional health check configuration with configurable paths and intervals |
| 📦 **Package Manager Choice** | Select npm, pnpm, yarn, or bun for Node.js-based frameworks |
| 🔀 **Compose v2 Spec Toggle** | Omit the `version:` field for the modern Compose Spec standard |
| 📱 **Fully Responsive** | Works seamlessly on desktop and mobile |
| 🖥️ **MUI-Themed UI** | Material UI AppBar, Tabs, Drawer, Chips — premium dark IDE aesthetic |
| 📚 **Docker Docs Panel** | Built-in side drawer with Dockerfile directives, Compose keys, quick commands & best practices |

---

## 📚 Docker Docs Panel

DockerCraft includes a built-in **Docker Reference Docs** side drawer accessible via the **"Docs" button** in the navigation bar.

The drawer slides in from the right and contains five sections:

| Section | Contents |
|---|---|
| **Official Docs** | Quick-link chips to docs.docker.com pages |
| **Dockerfile Directives** | 12 directives (FROM, RUN, COPY, WORKDIR, EXPOSE, ENV, CMD, ENTRYPOINT, ARG, HEALTHCHECK, USER, VOLUME) with syntax, description, example, and link |
| **Compose Keys** | 10 Compose spec keys (services, image, build, ports, environment, volumes, depends_on, networks, restart, healthcheck) |
| **Quick Commands** | 10 essential Docker CLI commands with descriptions |
| **Best Practices** | 8 Docker build best practices |
| **Multi-Stage Example** | Full annotated Node.js multi-stage Dockerfile example |

---

## 🛠️ Supported Frameworks

### JavaScript / TypeScript
| Framework | Default Port | Multi-Stage | Package Manager |
|---|---|---|---|
| Node.js | 3000 | ✅ | npm · pnpm · yarn · bun |
| Next.js | 3000 | ✅ | npm · pnpm · yarn · bun |
| React (Vite) | 80 | ✅ (+ Nginx) | npm · pnpm · yarn · bun |
| Bun | 3000 | ❌ | bun |
| Deno 🦕 | 8000 | ❌ | native |

### Python
| Framework | Default Port | Multi-Stage |
|---|---|---|
| FastAPI | 8000 | ❌ |
| Django | 8000 | ❌ |
| Flask | 5000 | ❌ |

### Systems / Backend
| Framework | Default Port | Multi-Stage | Notes |
|---|---|---|---|
| Go | 8080 | ✅ (scratch) | Minimal final image |
| Rust | 8080 | ✅ (debian-slim) | Cached dependency layer |
| Spring Boot (Java) | 8080 | ✅ | Eclipse Temurin JRE |
| Laravel (PHP) | 9000 | ❌ | php-fpm alpine |
| Ruby on Rails | 3000 | ❌ | |

### Server / Static
| Framework | Default Port |
|---|---|
| Nginx | 80 |
| Static Site | 80 |

### Service Presets (Docker Compose)
- **Databases**: PostgreSQL, MySQL, MongoDB
- **Cache**: Redis
- **Message Brokers**: RabbitMQ
- **Search**: Elasticsearch
- **Proxy**: Nginx

### Compose Output Options
| Option | Description |
|---|---|
| `docker-compose.yml` tab | Full YAML preview with copy & download |
| `.dockerignore` tab | Auto-generated generic `.dockerignore` for Compose projects |
| Compose v2 Spec toggle | Omit the `version:` key (modern Compose Spec / Docker Desktop v2+) |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [Material UI v5](https://mui.com/) (AppBar, Tabs, Drawer, Chip, Tooltip, Paper) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + CSS custom properties |
| **Icons** | [MUI Icons](https://mui.com/material-ui/material-icons/) + [Lucide React](https://lucide.dev/) |
| **Syntax Highlight** | [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |
| **Font** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| **Linting** | ESLint + TypeScript ESLint |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vitaltechmyanmar/DockerCraft.git
cd DockerCraft

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Lint source files with ESLint |

---

## 📁 Project Structure

```
docker-generator/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + Tailwind base layers + CSS vars
│   │   ├── layout.tsx           # Root layout + metadata + MuiThemeProvider
│   │   └── page.tsx             # Main page (MUI AppBar, Tabs, DockerDocsDrawer)
│   │
│   ├── components/
│   │   ├── compose/
│   │   │   ├── ComposeForm.tsx  # Docker Compose configuration form
│   │   │   ├── ComposePreview.tsx # Compose YAML preview + actions
│   │   │   └── ServiceCard.tsx  # Individual service configuration card
│   │   │
│   │   ├── dockerfile/
│   │   │   ├── DockerfileForm.tsx       # Dockerfile settings form
│   │   │   ├── DockerfilePreview.tsx    # Dockerfile preview + download
│   │   │   └── FrameworkSelector.tsx    # Framework picker grid
│   │   │
│   │   ├── shared/
│   │   │   ├── CopyButton.tsx           # Copy to clipboard button
│   │   │   ├── DownloadButton.tsx       # File download button
│   │   │   ├── DockerDocsDrawer.tsx     # [NEW] Docker reference docs side drawer
│   │   │   └── MuiThemeProvider.tsx     # [NEW] Client-side MUI ThemeProvider wrapper
│   │   │
│   │   └── ui/
│   │       └── spotlight.tsx    # (legacy — no longer used in UI)
│   │
│   ├── lib/
│   │   ├── generators/
│   │   │   ├── dockerfile.ts    # Dockerfile generation logic (per framework)
│   │   │   ├── compose.ts       # Docker Compose YAML generation
│   │   │   └── templates.ts     # Framework templates & service presets
│   │   ├── theme.ts             # [NEW] MUI dark theme (Docker blue palette)
│   │   └── utils.ts             # cn() utility, generateId()
│   │
│   └── types/
│       ├── dockerfile.ts        # DockerfileConfig, FrameworkTemplate types
│       └── compose.ts           # ComposeConfig, ServiceConfig types
│
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 🏛️ Architecture

### Data Flow

```
User Input (Form)
       │
       ▼
  React State (useState)
       │
       ▼
  Config Object (DockerfileConfig | ComposeConfig)
       │
       ▼
  Generator Function (lib/generators/)
       │
       ▼
  Generated String (Dockerfile / docker-compose.yml)
       │
       ▼
  Preview Panel (syntax highlighted)
       │
       ▼
  Copy / Download Action
```

### Key Design Decisions

1. **Pure Client-Side Generation** — All Dockerfile and Compose generation happens in the browser. No server calls, no latency, instant preview.
2. **MUI + Tailwind Hybrid** — MUI handles the layout shell (AppBar, Drawer, Tabs, Chips) while Tailwind + CSS custom properties continue powering the form components. This avoids a risky full rewrite.
3. **MUI Dark Theme** — A custom `dockerCraftTheme` in `lib/theme.ts` uses Docker's brand blue (`#0db7ed`) as the primary color. All component overrides are centralized in the theme for consistency.
4. **Client ThemeProvider Wrapper** — MUI's `ThemeProvider` uses React Context (client-only). It's wrapped in `MuiThemeProvider.tsx` (a `"use client"` component) and imported into the server `layout.tsx`, following Next.js App Router conventions.
5. **Framework-Specific Generators** — Each framework has its own dedicated generator function in `lib/generators/dockerfile.ts`, making it easy to add or modify framework support.
6. **Template-Driven Defaults** — `lib/generators/templates.ts` stores all framework metadata (default versions, ports, commands) separately from generation logic.
7. **CSS Custom Properties Design System** — All colors are defined as CSS variables (`--bg-base`, `--bg-panel`, `--border`, `--accent`, etc.) in `globals.css`. These co-exist with the MUI theme's `sx` prop styling.
8. **No Runtime Animation Library** — Framer Motion is no longer used in the UI layer. All transitions are plain CSS. This eliminates a ~50 kB gzip dependency from the interactive bundle.

---

## ☁️ Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use the Vercel dashboard by connecting your GitHub repository. The project deploys automatically on every push to `main`.

### Docker (Self-Hosted)

```dockerfile
# Build and run DockerCraft itself using Docker
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t dockercraft .
docker run -p 3000:3000 dockercraft
```

### Environment Variables

This project requires **no environment variables** for basic operation. All features are purely client-side.

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feat/add-deno-template`
3. **Commit** your changes: `git commit -m 'feat: add Deno framework template'`
4. **Push** to the branch: `git push origin feat/add-deno-template`
5. **Open** a Pull Request

### Adding a New Framework

1. Add the framework type to `src/types/dockerfile.ts` → `FrameworkId`
2. Add the template definition to `src/lib/generators/templates.ts` → `FRAMEWORK_TEMPLATES`
3. Add the generator function to `src/lib/generators/dockerfile.ts`
4. Add the `.dockerignore` entries in `generateDockerignore()` if needed

### Adding a New Service Preset (Compose)

1. Add the preset to `src/lib/generators/templates.ts` → `SERVICE_PRESETS`
2. Update the preset type in `src/types/compose.ts` if needed

---

## 📝 Changelog

### v1.3.0 — MUI Theme + Docker Docs Panel
- 🎨 **MUI v5 integration** — Added `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- 🧭 **MUI AppBar navigation** — Replaced legacy `<header>` with MUI `AppBar` + `Toolbar`; added MUI `Tabs` for Dockerfile/Compose switching with animated indicator
- 📚 **Docker Docs side drawer** — Right-side `Drawer` with 5 sections: Dockerfile directives (12), Compose keys (10), Quick commands (10), Best practices (8), Multi-stage build example
- 🎨 **Custom dark MUI theme** — `src/lib/theme.ts` with Docker blue (`#0db7ed`) primary, dark backgrounds, custom overrides for AppBar, Tabs, Chip, Paper, Drawer, Tooltip, Accordion
- 🧩 **MuiThemeProvider wrapper** — Client component wrapper following Next.js App Router `"use client"` conventions
- 💡 **Enhanced sub-header** — Version badge and description in slim sub-header bar
- 🔗 **Tooltip labels** — MUI Tooltips on all icon buttons in the navbar
- ⚡ **Pulse animation** — Animated live status indicator on AppBar and preview panel header

### v1.2.0 — UI Redesign (Minimal IDE)
- 🖥️ **Complete UI redesign** — replaced glassmorphism/blur with a clean flat dark IDE aesthetic
- 🎨 **CSS variable design system** — all UI colors via `--bg-base`, `--bg-panel`, `--border`, `--accent` tokens
- ⚡ **Removed Framer Motion from UI** — all animations replaced with plain CSS transitions (`transition-colors duration-150`), eliminating ~50 kB gzip from the interactive bundle
- 🗑️ **Removed** Spotlight component, ambient glows, animated gradient text, grid background
- 📐 **New layout** — slim 48px header + 36px sub-header with live stats, compact 36px footer
- 🧩 **FrameworkSelector** rebuilt without `motion.button` — plain buttons, tighter grid
- ✅ TypeScript: zero type errors

### v1.1.0 — Phase 3 Priority 1
- 🦕 **Deno framework** support added (port 8000, `denoland/deno` image)
- 📄 **`.dockerignore` tab** added to Compose Preview (copy + download)
- 🔀 **Compose v2 spec toggle** — removes `version:` field from YAML output
- 📦 **Package manager selector** for Node.js / Next.js / React (Vite) — npm, pnpm, yarn, or bun

### v1.0.0 — Initial Release
- 14 frameworks, 7 service presets, Dockerfile + Compose generators

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Next.js** · **Material UI** · **Tailwind CSS**

[⬆ Back to top](#-dockercraft)

</div>
