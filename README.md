# 🖥️ MacWidgets for Windows · 极简美化桌面小组件

[![Electron](https://img.shields.io/badge/Electron-31.3.1-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**MacWidgets for Windows** 是一款采用 `Electron + Vite + React + Tailwind/CSS Glassmorphism` 现代架构打造的高颜值、高性能 Windows 桌面美化与效率小组件应用。100% 深度复刻 **macOS Sonoma / Sequoia** 的「深海高透毛玻璃质感与网格排版」，并提供无缝的「看板网格模式」与「自由悬浮散贴模式」双重体验。

---

## ✨ 核心亮点 & 功能特性

### 1. 🔄 独创双重形态：看板网格 vs 自由散贴
- **🖥️ 看板网格模式 (Dashboard Board Mode)**：完整复刻 macOS 整块深色毛玻璃侧边栏/主看板。所有小组件严格在标准的尺寸网格（`1x1`, `2x1`, `2x2`, `4x2`, `2x3` 等）中自动对齐排列，清爽整洁。
- **🏝️ 自由散贴模式 (Floating Islands Mode)**：一键切换后，大底板透明消失！每一个小组件都独立化身桌面上的浮动小岛：
  - 支持 **按住拖动** 到桌面的任意坐标角落并自动记忆本地坐标。
  - 支持 **一键锁定 (🔒 Lock Position)**：锁定后卡片固定在桌面层，防止打字或勾选待办时误拖动。
  - 支持 **顶置层级开关 (📌 Topmost / Pin)**：可随时把选定的组件固定在系统最前面。

### 2. 🎨 3 套定制极简主题板
- 🌊 **青蓝深海 (Deep Sea Teal)**：高亮青色 `#00F5D4` 搭配深蓝绿底 `#264653` 磨砂毛玻璃，极具高级沉浸感。
- 🖤 **黑晶石墨 (Dark Graphite)**：极简深空灰灰黑毛玻璃 `#1C1C1E`，适合程序员与暗色控。
- ❄️ **通透白霜 (Frosted Glass White)**：明亮清爽的经典苹果高透玻璃。

### 3. 🧩 7 大核心精美模块 (内置与可扩展)

| 组件模块 | 规格尺寸 | 核心功能 |
| :--- | :---: | :--- |
| **⏰ 时钟与农历日历** | `2x1` / `2x2` | 极简大字号实时数字时钟 + **精准中国农历（如：六月初九）** + 节气与周一至周日全览矩阵。 |
| **🔋 设备电量监控盘** | `1x1` / `2x2` | Apple 经典环形进度条仪表盘，对接底层 API 实时监测当前电脑电量、充电状态，并展示耳机/手表等外接设备状态。 |
| **✅ 每日待办清单** | `2x2` / `4x2` | 极速任务清单，点击实时完成并展现**划线划去微动画**，支持直接打字回车新增、一键删除与进度统计。 |
| **📝 记事本/灵感卡** | `2x2` / `2x3` | 复刻经典便签本，支持切换黄、青、粉、深海蓝等主题调色盘，输入内容实时持久本地保存。 |
| **💬 每日金句看板** | `2x1` / `4x1` | `#每日一句` 精选达芬奇、乔布斯、中英对照名言，更支持 **一键朗读 (TTS 语音合成)** 与随机刷新下一句。 |
| **📁 快捷启动池** | `2x2` / `4x2` | 极具辨识度的彩色圆角书签方块（如“马上整理”、“电脑壁纸”、“小红书灵感”等），直达文件或网址。 |
| **☀️ 习惯打卡与天气** | `2x1` / `2x2` | 本地气温/空气质量 + 周日一二三四五六 7日 **专注习惯打卡矩阵 (S M T W T F S)**。 |

---

## 🛠️ 快速起步 & 开发指南

### 环境要求
- [Node.js](https://nodejs.org/) v18+ (推荐 v20 / v22)
- npm 或 yarn / pnpm

### 1. 克隆项目 & 安装依赖
```bash
git clone https://github.com/zcxzcxzcx111/-Minimalist-Desktop-Widgets.git
cd -Minimalist-Desktop-Widgets
npm install
```

### 2. 开发预览 (热更新 Vite + Electron)
运行以下命令，即可自动启动 Vite 本地渲染服务器并唤起无边框透明 Electron 窗口：
```bash
npm run start
# 或直接分别启动
npm run dev
npm run electron
```

### 3. 打包生成应用 EXE / DMG / deb
将当前美化小组件打包生成可以直接在 Windows 电脑上安装运行的应用程序：
```bash
npm run build
# 然后使用 electron-builder 构建
npx electron-builder --win
```

---

## 📂 项目文件架构说明

```
├── public/                 # 静态资源与应用图标
├── scripts/
│   └── dev-runner.js       # 开发模式一键自动唤起 Vite + Electron 脚本
├── src/
│   ├── main.js             # Electron 主进程 (创建无边框透明窗口/IPC通信/点击穿透)
│   ├── renderer/
│   │   ├── App.jsx         # 核心渲染器，控制「看板模式」与「自由悬浮模式」容器
│   │   ├── main.jsx        # React 入口
│   │   ├── index.css       # 核心样式系统 (Mac Sonoma 毛玻璃、极简字形、响应式网格)
│   │   └── components/
│   │       ├── HeaderBar.jsx       # 顶部控制栏 (模式切换/锁定拖拽/主题配色/最小化)
│   │       ├── WidgetContainer.jsx # 组件外框 (拖曳坐标计算/卡片放大缩小/悬浮控制)
│   │       ├── WidgetModal.jsx     # Mac 风格组件库弹窗 (选组件、选尺寸一键添加)
│   │       └── widgets/
│   │           ├── ClockWidget.jsx     # 时历组件
│   │           ├── BatteryWidget.jsx   # 电量监控卡
│   │           ├── TodoWidget.jsx      # 待办清单卡
│   │           ├── NoteWidget.jsx      # 记事便签卡
│   │           ├── QuoteWidget.jsx     # 语音朗读名言卡
│   │           ├── LauncherWidget.jsx  # 快捷指令分类卡
│   │           └── WeatherWidget.jsx   # 天气与习惯打卡卡
│   └── utils/
│       └── lunar.js        # 中国农历与节气精准换算算法
├── index.html              # HTML5 模板，引入 Google Inter/Outfit 字形
├── vite.config.js          # Vite 构建配置
└── package.json            # 依赖包及启动指令配置
```

---

## 🤝 贡献与许可 (License)

本项目遵循 [MIT License](LICENSE)。非常欢迎提交 PR 或 Issue 一起拓展更多酷炫的 Mac 桌面小组件！
