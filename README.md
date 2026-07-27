<div align="center">

<img src="https://img.shields.io/badge/DockerCraft-v1.0.0-0db7ed?style=for-the-badge&logo=docker&logoColor=white" alt="DockerCraft" />

# 🐳 DockerCraft

### _Generate Production-Ready Docker Configurations Instantly_

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[🚀 Live Demo](https://github.com/vitaltechmyanmar/DockerCraft) · [📖 Docs](#-project-structure) · [🐛 Issues](https://github.com/vitaltechmyanmar/DockerCraft/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Supported Frameworks](#-supported-frameworks)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DockerCraft** is a modern, open-source web application that helps developers generate production-ready `Dockerfile` and `docker-compose.yml` files with a visual, interactive interface. No more copy-pasting from StackOverflow or memorizing Docker best practices — DockerCraft handles it all with sensible defaults and real-time preview.

> **"Configure your stack, preview instantly, copy or download. Best-practice defaults included."**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎛️ **Dockerfile Generator** | Generate optimized Dockerfiles for 14+ frameworks with multi-stage builds |
| 🧩 **Compose Generator** | Build multi-service `docker-compose.yml` with service presets (PostgreSQL, Redis, etc.) |
| ⚡ **Live Preview** | Real-time output updates as you configure your settings |
| 📋 **Copy to Clipboard** | One-click copy of generated output |
| 📥 **Download Files** | Download `Dockerfile`, `.dockerignore`, and `docker-compose.yml` directly |
| 🛡️ **Security Best Practices** | Non-root user, minimal base images, `.dockerignore` generation |
| 🏗️ **Multi-Stage Builds** | Optimized multi-stage builds for smaller production images |
| 🏥 **Health Checks** | Optional health check configuration with configurable paths and intervals |
| 📱 **Fully Responsive** | Works seamlessly on desktop and mobile |
| 🌑 **Dark Mode UI** | Stunning glassmorphism dark UI with animated spotlights |

---

## 🛠️ Supported Frameworks

### JavaScript / TypeScript
| Framework | Default Port | Multi-Stage | Package Manager |
|---|---|---|---|
| Node.js | 3000 | ✅ | npm |
| Next.js | 3000 | ✅ | npm |
| React (Vite) | 80 | ✅ (+ Nginx) | npm |
| Bun | 3000 | ❌ | bun |

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

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 11](https://www.framer.com/motion/) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) (Select, Tabs, Switch, Slider, Tooltip) |
| **Icons** | [Lucide React](https://lucide.dev/) |
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
│   │   ├── globals.css          # Global styles + Tailwind base layers
│   │   ├── layout.tsx           # Root layout + metadata + fonts
│   │   └── page.tsx             # Main page (tab switcher, layout, hero)
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
│   │   │   ├── CopyButton.tsx   # Copy to clipboard button
│   │   │   └── DownloadButton.tsx # File download button
│   │   │
│   │   └── ui/
│   │       └── spotlight.tsx    # Aceternity-style spotlight effect
│   │
│   ├── lib/
│   │   ├── generators/
│   │   │   ├── dockerfile.ts    # Dockerfile generation logic (per framework)
│   │   │   ├── compose.ts       # Docker Compose YAML generation
│   │   │   └── templates.ts     # Framework templates & service presets
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
2. **Framework-Specific Generators** — Each framework has its own dedicated generator function in `lib/generators/dockerfile.ts`, making it easy to add or modify framework support.
3. **Template-Driven Defaults** — `lib/generators/templates.ts` stores all framework metadata (default versions, ports, commands) separately from generation logic.
4. **Radix UI Primitives** — Accessible, unstyled components from Radix UI are used for all interactive form controls (Select, Switch, Slider, Tabs), providing WAI-ARIA compliance out of the box.
5. **Framer Motion** — Smooth tab transitions and entrance animations are powered by Framer Motion's `AnimatePresence` and `motion` components.
6. **Multi-Stage by Default** — For frameworks that support it, multi-stage builds are enabled by default to produce smaller, more secure production images.

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

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Next.js** · **Tailwind CSS** · **Framer Motion**

[⬆ Back to top](#-dockercraft)

</div>
