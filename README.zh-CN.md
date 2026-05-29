<div align="center">

# Durham Room

**杜伦大学学生批量房间预约助手**

简体中文 | [English](./README.md)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

<br/>

为 St John's College 学生打造的高效批量房间预约工具，
一次选择多个时间段，一键完成批量预约。

</div>

---

## 功能特性

- **批量预约** — 在日历上选择多个时间段，一键完成全部预约。支持按上午、下午、晚上快速筛选。
- **可视化日历** — 清晰的月历视图，今日高亮、周末着色，实时显示可预约时间段。
- **智能管理** — 查看所有即将到来的预约，支持一键取消，批量预约进度实时反馈成功/失败统计。
- **自动重试** — 优雅处理 SimplyBook.it 的速率限制，指数退避最多重试 3 次。
- **骨架屏加载** — 闪光占位符替代通用加载动画，加载体验更流畅。
- **暗色玻璃态 UI** — 精致的暗色模式界面，搭配 Phosphor 图标、氛围渐变光球和微交互。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/)（App Router、Turbopack） |
| UI 库 | [React 19](https://react.dev/) |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com/) |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| 图标 | [Phosphor Icons](https://phosphoricons.com/) |
| 字体 | [Geist](https://vercel.com/font) + Geist Mono |
| 预约 API | [SimplyBook.it](https://simplybook.me/) |

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)（推荐）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/alvinluo-tech/fast-room-booking.git
cd fast-room-booking

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

### 构建部署

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
├── app/
│   ├── api/              # API 路由
│   │   ├── auth/login    # 用户认证
│   │   ├── slots/        # 获取可预约时间段
│   │   ├── book/         # 单次预约
│   │   ├── batch-book/   # 批量预约
│   │   └── bookings/     # 预约列表与取消
│   ├── bookings/         # 我的预约页面
│   ├── login/            # 登录页面
│   ├── slots/            # 日历与时间段选择
│   ├── page.tsx          # 首页
│   ├── layout.tsx        # 根布局
│   └── globals.css       # 全局样式与动画
├── components/           # 共享 UI 组件
│   ├── GlassCard.tsx
│   ├── GradientButton.tsx
│   ├── GhostButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── NavBar.tsx
│   ├── PageShell.tsx
│   └── StatusBadge.tsx
└── lib/
    └── simplybook.ts     # SimplyBook.it API 客户端
```

## 页面说明

| 路由 | 说明 |
|------|------|
| `/` | 首页，功能介绍 |
| `/login` | SimplyBook.it 账户登录 |
| `/slots` | 日历视图 + 时间段选择 + 批量预约 |
| `/bookings` | 预约列表，支持取消操作 |

## API 路由

| 方法 | 端点 | 说明 |
|------|------|------|
| `POST` | `/api/auth/login` | 邮箱密码登录 |
| `GET` | `/api/slots` | 获取可预约时间段 |
| `POST` | `/api/book` | 单次预约 |
| `POST` | `/api/batch-book` | 批量预约 |
| `GET` | `/api/bookings` | 获取预约列表 |
| `DELETE` | `/api/bookings/[id]` | 取消预约 |

## 开源协议

本项目基于 [MIT 协议](./LICENSE) 开源。

---

<div align="center">

使用 Next.js、React 和 Tailwind CSS 构建

</div>
