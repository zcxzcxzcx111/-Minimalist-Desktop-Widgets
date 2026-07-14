# 🖥️ MacWidgets for Windows · 极简独立多窗口桌面小组件

[![Electron](https://img.shields.io/badge/Electron-31.3.1-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**MacWidgets for Windows** 是一款采用 `Electron + Vite + React + Tailwind/CSS Glassmorphism` 现代架构打造的高颜值、高性能 Windows 桌面美化与效率小组件应用。100% 深度复刻 **macOS Sonoma / Sequoia** 的深海高透毛玻璃质感，并采用全新升级的 **「真正独立多窗口架构 (True Multi-Window Architecture)」**，让每一个卡片都能在桌面上随心所欲自由排布！

---

## ✨ 核心升级与产品亮点

### 1. 🚀 真正独立多窗口架构 (True Multi-Window Architecture)
告别把所有卡片塞在一个大浏览器画布里的传统做法！现在的 **MacWidgets**：
- **每一张卡片都是一个独立的原生透明窗口**：按住任何卡片的边缘或背景，都能随意拖动到桌面的任何位置（甚至是不同显示器角落）。
- **完全不阻碍桌面操作**：每一个小组件仅占用其自身精准的网格尺寸（如 `1x1`、`2x2`），卡片周围的桌面空白处依然能够自由框选文件、双击快捷方式或右键菜单！
- **自动记忆精准坐标**：你在桌面上摆放好各个卡片的位置后，主进程会将你的精细布局持久化保存，下次开机或重新启动插件时，所有卡片都会自动从原位优雅浮现。

### 2. 🎛️ 焕然一新的控制中心 (Control Hub)
- **高对比宽屏大卡片挑选库**：彻底解决了老版本弹窗拥挤和字形重叠的问题。全新设计的 `MacWidgets 控制中心` 拥有极佳的视觉呼吸感，左侧浏览模块，右侧管理当前桌面上的所有活跃卡片。
- **一键置顶与快拆**：你可以为桌面上的关键小组件（如待办清单、时钟）单独开启 **「📌 置顶到最高层」**，让它时刻浮在网页和办公软件上方！

### 3. 🎨 3 套极简高透主题色板
- 🌊 **青蓝深海 (Deep Sea Teal)**：高亮青色 `#00F5D4` 搭配深蓝绿底 `#264653` 磨砂毛玻璃。
- 🖤 **黑晶石墨 (Dark Graphite)**：极简深空灰灰黑毛玻璃 `#1C1C1E`，专注高效。
- ❄️ **通透白霜 (Frosted Glass White)**：明亮清爽的经典苹果高透玻璃。

---

## 🧩 7 大独立精美模块库

| 组件模块 | 规格尺寸 | 核心功能与交互 |
| :--- | :---: | :--- |
| **⏰ 时钟与农历日历** | `2x1` / `2x2` | 极简大字号实时数字时钟 + **精准中国农历（如：六月初九）** + 节气与周一至周日全览点亮。 |
| **🔋 设备电量监控盘** | `1x1` / `2x2` | Apple 经典深色环形进度条仪表盘，监测当前电脑电量百分比与周边设备续航。 |
| **✅ 每日待办清单** | `2x2` / `4x2` | 在桌面上直接勾选完成并展现**划线划去微动画**，回车快速新增任务，一键清除已办。 |
| **📝 记事本/灵感卡** | `2x2` / `2x3` | 经典便签本，支持切换黄、青、粉、蓝等多调色盘，输入字句实时持久本地保存。 |
| **💬 每日金句看板** | `2x1` / `4x1` | `#每日一句` 精选名言，中英对照，支持 **一键朗读 (TTS 语音合成)** 与随机刷新。 |
| **📁 快捷启动池** | `2x2` / `4x2` | 色彩鲜艳的苹果圆角标签方块，点击直达特定网址或本地命令工作流。 |
| **☀️ 习惯打卡与天气** | `2x1` / `2x2` | 气温与空气质量看板 + 周日一二三四五六 7日 **习惯专注时长打卡点亮矩阵**。 |

---

## 🛠️ 快速起步与使用指南

### 1. 克隆项目 & 安装依赖
```bash
git clone https://github.com/zcxzcxzcx111/-Minimalist-Desktop-Widgets.git
cd -Minimalist-Desktop-Widgets
npm install
```

### 2. 本地一键启动 (生成独立卡片窗口)
```bash
npm run start
```
*提示：你也可以随时双击桌面上我们为你生成的 **`MacWidgets.lnk`** 快捷方式一键无感启动！*

### 3. 如何管理卡片与控制台？
- **开启控制后台**：双击系统任务栏右下角的 **MacWidgets 图标** 即可随时呼出控制中心。
- **拖拽小组件**：鼠标按住任何小组件卡片的空白/毛玻璃区域，即可随意移动到桌面任何位置。
- **悬浮工具小胶囊**：鼠标悬停在卡片右上角，会自动浮现 `[📌 置顶]` `[⚙️ 尺寸切换]` `[✖ 关闭]` 的快捷胶囊按键。

---

## 🤝 贡献与许可 (License)

本项目遵循 [MIT License](LICENSE)。非常欢迎提交 PR 或 Issue 一起拓展更多酷炫的 Mac 桌面小组件！
