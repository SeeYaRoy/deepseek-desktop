# DeepSeek Desktop

DeepSeek Chat 的非官方桌面客户端，基于 Electron 构建，支持 macOS 和 Windows。

![DeepSeek Desktop](resources/logo.svg)

## 功能

- **原生桌面体验** — 将 DeepSeek Chat 封装为桌面应用，支持独立窗口运行
- **持久登录** — 自动保存登录会话，无需每次重新登录
- **系统托盘** — 最小化到托盘，右键菜单快速操作
- **全局快捷键** — `Cmd/Ctrl+Shift+D` 快速唤出/隐藏窗口
- **消息通知** — 收到 AI 回复时弹出 macOS/Windows 原生通知（带提示音）
- **多语言支持** — 通知文案自动跟随系统语言（中文/英文）
- **窗口记忆** — 自动记住窗口位置和大小
- **角标提醒** — macOS Dock 角标显示未读消息数

## 安装

### macOS

1. 下载 `DeepSeek Desktop-x.x.x.dmg`
2. 双击挂载 DMG，将应用拖到 Applications 文件夹
3. 首次打开时如遇安全提示，前往 **系统设置 → 隐私与安全性 → 安全性** 点击"仍要打开"

### Windows

1. 下载 `DeepSeek Desktop Setup x.x.x.exe`
2. 运行安装程序，按向导完成安装

## 使用

| 操作 | macOS | Windows |
|------|-------|---------|
| 唤出/隐藏窗口 | `Cmd + Shift + D` | `Ctrl + Shift + D` |

### 托盘操作

- **左键点击** — 显示/隐藏主窗口
- **右键菜单** — 打开窗口 / 新建对话 / 退出应用

### 通知行为

- 当窗口处于**非焦点**或**隐藏**状态时收到 AI 回复，会弹出系统通知
- 点击通知可直接唤出应用窗口
- 通知文案跟随系统语言：
  - 中文系统："你收到了 DeepSeek 的回复"
  - 其他语言："You received a reply from DeepSeek"

### 退出应用

- **macOS**：`Cmd + Q` 或托盘右键 → 退出
- **Windows**：点击窗口关闭按钮或托盘右键 → 退出

## 开发

### 环境要求

- Node.js 18+
- npm 9+

### 本地运行

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建
npm run build

# 预览生产构建
npm run preview
```

### 打包

```bash
# 打包当前平台
npm run dist

# 仅打包 macOS
npm run dist:mac

# 仅打包 Windows
npm run dist:win
```

打包产物位于 `dist/` 目录。

## 技术栈

- [Electron](https://www.electronjs.org/) 35
- [TypeScript](https://www.typescriptlang.org/)
- [electron-vite](https://electron-vite.org/) — Vite 构建工具
- [electron-builder](https://www.electron.build/) — 应用打包
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — 本地缓存
- [electron-store](https://github.com/sindresorhus/electron-store) — 配置存储

## 项目结构

```
deepseek-desktop/
├── src/
│   ├── main/           # 主进程（窗口、托盘、快捷键、通知）
│   ├── preload/        # 预加载脚本（安全桥接）
│   └── renderer/       # 渲染进程注入脚本
├── resources/          # 图标资源
├── build/              # 构建产物
├── dist/               # 打包产物
├── electron.vite.config.ts
├── electron-builder.yml
└── package.json
```

## 免责声明

本项目为第三方开源客户端，与 DeepSeek 官方无关。使用 DeepSeek 服务须遵守其服务条款。

## 许可证

MIT License

Copyright (c) 2026 Roy Chen
