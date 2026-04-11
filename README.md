# Jimmy's Blog

![preview](./public/static/images/preview.png)

[![Live](https://img.shields.io/badge/在线访问-sleeprhino.com-cba6f7?style=flat-square&logo=firefoxbrowser&logoColor=white)](https://sleeprhino.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-deployed-2496ed?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Deploy](https://img.shields.io/github/actions/workflow/status/nEvErMoReaken/Adam/deploy.yml?style=flat-square&logo=githubactions&logoColor=white&label=deploy)](https://github.com/nEvErMoReaken/Adam/actions)

**[🇨🇳 中文]** · [🇬🇧 English](./README.en.md)

---

## 项目简介

IDE / 终端风格的个人博客，以 Catppuccin 配色系统为主题，双栏分屏布局，支持中英文切换。

**核心特性：**

- **终端 UI** — 标签页导航、分屏 pane、状态栏 footer、斜杠命令面板（`/blog`、`/about`…）
- **Catppuccin 主题** — Latte（亮）/ Mocha（暗）/ Old Hope 三套配色
- **中英双语** — 全站文字切换，localStorage 持久化
- **Discord 状态** — 主页实时显示在线状态 + 当前活动（via Lanyard WebSocket）
- **nvidia-smi 风格 About 页** — ASCII 进度条、项目进程表、技能利用率
- **`llms-full.txt`** — 机器可读个人简介，供 AI agent 使用

## TerminalPet · 桌面宠物

仿 Claude Code 内置终端宠物实现，按 `/` 调出命令面板后可见。

```
   /\_/\
  ( · · )
  ( u  )
  (*)_(*)
```

- **5 种稀有度**：普通 / 稀有 / 精良 / 史诗 / 传说（带概率权重随机）
- **8 种帽子**：王冠、大礼帽、螺旋帽、光环、巫师帽…
- **5 项属性**：DEBUGGING / PATIENCE / CHAOS / WISDOM / SNARK
- **闪光变体**：传说级有概率出现，带发光动画
- **孵化动画**：召唤时有破壳特效

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 15 App Router |
| 样式 | Tailwind CSS 4 + Catppuccin |
| 内容 | Contentlayer 2 (MDX) |
| i18n | 自定义 zh/en Context |
| 部署 | Docker + VPS + GitHub Actions |

## 本地开发

```bash
yarn install
yarn dev   # http://localhost:3000
```

## 部署

推送到 `main` → GitHub Actions SSH 到 VPS → `docker build` → 重启容器。

所需 Secrets：`VPS_HOST` `VPS_USER` `VPS_PASSWORD` `VPS_PORT`

## Changelog

详见博客文章 [sleeprhino.com/blog/changelog](https://sleeprhino.com/blog/changelog)
