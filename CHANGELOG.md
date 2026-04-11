# Changelog

## 2026-04

### feat: /search 接入 kbar 全文搜索，Ctrl+K 修复 `d919495`

- `SlashCommandPanel` 引入 `useKBar`，`/search` 改为调用 `query.toggle()` 打开全文搜索
- 内置 `Ctrl+K` 监听，正确聚焦输入框并展开面板
- `GlobalKeyboardShortcuts` 移除重复的 `Ctrl+K` 逻辑
- `layout.tsx` 将 Footer 移入 `SearchProvider` 内，使 `useKBar` 可用

---

### fix: Tag 组件添加 use client 支持 onClick 埋点 `8b71586`

---

### feat: 添加 Umami 用户行为埋点 `510ee4f`

- 为导航、主题切换、语言切换、评论、标签点击等关键交互添加 `umami.track` 埋点

---

### chore: 接入 Umami 统计 `73d8152`

---

### feat: 移动端访问体验优化 `cc65ad5`

---

### feat: 评论区自动加载，无需手动点击 `6b213fd`

---

### feat: 评论区标题栏显示评论数，加闪烁光标和引导提示 `f557384`

---

### feat: 像素风格全局 loading 进度条 `8525d68`

- 分块像素动画 + 发光头部，路由跳转时触发

---

### feat: GitHub OAuth 评论系统 `8725a4d`

- 终端风格，`git push` 发评论，后端调 GitHub Discussions API

---

### ci: typecheck job + Node 24 升级 `9c993ab` `d71c372`

- 新增 CI typecheck，TS 类型错误提前拦截，不进 Docker build

---

### feat: 终端风格评论组件 `cc54612`

- `git log` 样式渲染评论，后端通过 GitHub Discussions API 读写

---

### feat: /tokens 页面展示 AI token 用量统计 `d12e37b`

---

### feat: 接入 Code::Stats，主页新增 CLI 风格统计面板 `6e0a0a8`

---

### feat: 正文字体换为 Space Grotesk `3bec6fa`

- 代码 / UI 保留 JetBrains Mono

---

### docs: 计算机网络应用层篇博客重写 `171f854` `bbb5113`

- 添加五张 CLI 风格 SVG 内联图

---

### feat: 环形缓冲区博客 + 交互可视化组件 `a7de334` `77e92d4` `5d3bde5`

- 移植 `RingBufferViz` / `GoGateBufferViz` / `Admonition` / `Tabs`
- `GoGateBufferViz` 改为交互式，演示位运算取模

---

## 2026-03

### feat: IDE 终端美学重设计，Catppuccin 主题系统 `0671bcd`

- CSS 自定义属性（`--c-*`）替换默认 Tailwind 色板
- Catppuccin **Latte**（浅色）/ **Mocha**（深色）/ **An Old Hope** 三主题
- 主字体改为 JetBrains Mono + Noto Sans SC

---

### feat: 全局中英文切换（i18n） `6c591b5`

- `lib/i18n.tsx`：`LangProvider` + `useLang()` hook，`localStorage` 持久化
- 约 35 个 UI 字符串的完整中 / 英翻译

---

### feat: 全站 IDE 布局重构（PaneLayout） `a596748`

- `PaneLayout` / `Pane` 组件，统一双栏面板结构
- 文章列表文件权限风格（`-rw-r--r--`），带标签侧栏

---

### feat: Footer 状态栏 + SlashCommandPanel `f89cc24`

- shell prompt 格式状态栏：`[sleeprhino] ~/路径/`
- `/` 键激活命令面板，支持页面跳转和主题切换

---

### feat: TerminalPet 桌面宠物 `870c256`

- 固定右下角，5 种稀有度、8 种帽子、5 项属性
- 传说级有概率出现闪光变体

---

### feat: 全键盘导航 `2384e44`

- `g` + `h/b/p/a/c` 跳转，`j/k` 上下选文章，`[/]` 翻页
- `?` 弹出快捷键速查面板

---

### feat: Discord 实时状态（Lanyard WebSocket） `早期`

---

### feat: About 页 nvidia-smi 终端风格面板 `早期`

- ASCII 进度条、项目进程表、技能利用率，双语

---

### feat: Docker 部署 + GitHub Actions CI/CD `早期`

- 推送 `main` → SSH → `docker build` → 重启容器
