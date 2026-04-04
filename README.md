# Jimmy's Blog

![preview](./public/static/images/preview.png)

[![Live](https://img.shields.io/badge/live-sleeprhino.com-blue?style=flat-square&logo=vercel)](https://sleeprhino.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-deployed-2496ed?style=flat-square&logo=docker)](https://docker.com)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/nEvErMoReaken/Adam/deploy.yml?style=flat-square&logo=github-actions&label=deploy)](https://github.com/nEvErMoReaken/Adam/actions)

IDE/terminal-style personal blog. Catppuccin theme, split-pane layout, bilingual (zh/en).

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS 4 + Catppuccin |
| Content | Contentlayer 2 (MDX) |
| i18n | Custom zh/en context |
| Deploy | Docker + VPS + GitHub Actions |

## Dev

```bash
yarn install
yarn dev       # http://localhost:3000
```

## Deploy

Push to `main` → GitHub Actions SSHes into VPS → `docker build` → restart container.

Required secrets: `VPS_HOST` `VPS_USER` `VPS_PASSWORD` `VPS_PORT`

---

## Changelog

### 2026-04

- feat: Discord real-time status via Lanyard WebSocket
- feat: Homepage personal info KV panel + robot hint (`llms-full.txt`)
- feat: About page — nvidia-smi style terminal panel (bilingual)
- feat: Docker deployment + GitHub Actions CI/CD

### 2026-03

- feat: IDE/terminal split-pane layout (PaneLayout)
- feat: Catppuccin theme system (Latte / Mocha / Old Hope)
- feat: Global zh/en language switch (localStorage)
- feat: Slash command panel (`/blog`, `/about`, etc.)
- feat: TerminalPet desktop companion
- feat: Footer as status bar
- feat: `llms-full.txt` — machine-readable profile for AI agents
- feat: DOS-style scrollbar (square, arrow buttons)
- chore: Migrated 5 blog posts from old static site
