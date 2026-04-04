# Changelog

## [Unreleased] — 2026-04-04

### feat: IDE 终端美学重设计，引入 Catppuccin 主题系统 `0671bcd`

- 用 CSS 自定义属性（`--c-*`）替换默认 Tailwind 色板
- 实现 Catppuccin **Latte**（浅色）/ **Mocha**（深色）双主题
- 新增 **An Old Hope** 暗色主题，金色高亮（`--c-blue: #e5cd52`）
- `dark:` variant 扩展覆盖 `.mocha` 和 `.old-hope`
- 主字体改为 **JetBrains Mono** + **Noto Sans SC**（中文回退）
- ThemeProvider 注册三套主题，禁用跟随系统
- ThemeSwitch 简化为极简 `[☀]`/`[☾]` 切换按钮

---

### feat: 全局中英文切换（i18n） `6c591b5`

- 新增 `lib/i18n.tsx`：`LangProvider` + `useLang()` hook，`localStorage` 持久化
- 覆盖约 35 个 UI 字符串的完整中/英翻译对象
- Header 新增 `[EN]`/`[中文]` 切换按钮，移除 ThemeSwitch
- `headerNavLinks` 标题改为 `{ zh, en }` 双语结构，增加 `index` 字段

---

### feat: 全站 IDE 布局重构（PaneLayout + 终端风格） `a596748`

- 新增 `PaneLayout` / `Pane` 组件，统一双栏面板结构
- 主页改为 IDE 双栏布局（`$ whoami` + 快速导航）
- 文章列表采用文件权限风格条目（`-rw-r--r--`），带标签侧栏
- 移动端标签栏**默认折叠**，点击展开
- `PostLayout` / `PostSimple` 重构为双栏，右侧 meta 栏（作者、标签、前后篇）
- 全部页面接入 `useLang()` 实现双语 UI
- 删除已弃用的 `LayoutWrapper`

---

### feat: Footer 状态栏重设计 + 命令面板 `f89cc24`

- 状态栏左侧改为 shell prompt 格式：`[sleeprhino] ~/路径/`
- 主题切换改为单按钮 + 向上弹出下拉菜单（latte / mocha / old hope）
- 菜单项悬浮下划线 + pointer cursor，激活态蓝色圆点标记
- 新增 `SlashCommandPanel`：`/` 键激活，支持页面跳转和主题切换命令
- 面板顶部 tips 提示行（`/ 命令 · ? 快捷键`），中英双语随全局语言切换
- 新增 `/contact` 联系页面

---

### feat: TerminalPet 桌面宠物 `870c256`

- 固定右下角，随机宠物 + 稀有度系统 + 悬浮状态卡
- 语言跟随全局 `useLang()`，移除独立语言切换按钮
- **fix**: 初始化 `footerTop` 为 `null`，修复刷新时宠物闪现页面顶部的问题

---

### feat: 全键盘导航支持 `2384e44`

- 新增 `GlobalKeyboardShortcuts`：
  - `g` + `h`/`b`/`p`/`a`/`c` → 跳转主页 / 文章 / 项目 / 关于 / 联系
  - `Ctrl+K` / `Cmd+K` → 聚焦命令面板输入框
- 新增 `KeyboardHelp`：`?` 弹出快捷键速查面板，中英双语，`Esc` 关闭
- 文章列表键盘操作：
  - `j` / `k` → 上下移动选中（蓝色 outline 高亮）
  - `Enter` → 打开选中文章
  - `[` / `]` → 上一页 / 下一页
- 文章阅读键盘操作：
  - `n` → 下一篇，`p` → 上一篇，`u` → 返回文章列表
