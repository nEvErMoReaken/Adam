# Adam — Jimmy's Blog

Personal blog built with Next.js 15 + Tailwind CSS 4, styled as an IDE/terminal interface with Catppuccin theme.

**Live:** [sleeprhino.com](https://sleeprhino.com)

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + Catppuccin (Latte / Mocha)
- Contentlayer 2 (MDX)
- Deployed via Docker on VPS, CI/CD via GitHub Actions

## Dev

```bash
yarn install
yarn dev
```

## Deploy

Push to `main` — GitHub Actions SSHes into VPS, rebuilds Docker image, restarts container.

---

## Changelog

### 2026-04

- feat: Discord real-time status via Lanyard WebSocket
- feat: Homepage left pane — personal info KV + robot hint
- feat: About page — nvidia-smi style terminal panel (bilingual)
- feat: Docker deployment + GitHub Actions CI/CD
- fix: MDX illegal characters, TypeScript null safety, MobileNav key types
- fix: ESLint ignored during build (prettier alignment false positives)

### 2026-03

- feat: IDE/terminal layout with PaneLayout + split panes
- feat: Catppuccin theme system (Latte light / Mocha dark)
- feat: Global zh/en language switch (persisted in localStorage)
- feat: Slash command panel (`/blog`, `/about`, etc.)
- feat: TerminalPet desktop companion
- feat: Footer as status bar with path + theme switcher
- feat: Keyboard navigation support
- feat: `llms-full.txt` — machine-readable profile for AI agents
- fix: DOS/terminal style scrollbar (square, arrow buttons)
- fix: Footer text selection disabled
- chore: Migrated 5 blog posts from old static site
- chore: Removed all sample content, updated author info (Jimmy / BYD)
